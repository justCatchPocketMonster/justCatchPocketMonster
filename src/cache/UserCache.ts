// @ts-ignore
import NodeCache from 'node-cache';
import User from '../models/User';
import UserType from '../types/UserType';

const userCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
let userUpdates: { [id: string]: String } = {};

const getUser = async (id: string): Promise<UserType> => {
    let userString:String | undefined = userCache.get<String>(id);
    console.log(id)

    if (userString === undefined || userString === null) {
        let user = await User.findOne({ id }).exec();
        
        if (!user) {
            user = new User({ id });
            
        }
        userCache.set(id, JSON.stringify(user));
        userString = userCache.get<String>(id);
    }

    if (userString === undefined) {
        throw new Error("userString est undefined, impossible de parser.");
    }
    console.log("data:",JSON.parse(userString as string))
    return JSON.parse(userString as string);
};

const updateUser = (id: string, data: UserType) => {

    userUpdates[id] = JSON.stringify(data);
    userCache.set(id, JSON.stringify(data));
};

const scheduleSave = () => {
    setInterval(async () => {
        const updates: { [id: string]: UserType } = {} = {}
        for (const id in userUpdates) {
            updates[id] = JSON.parse(userUpdates[id] as string);
        }

        userUpdates = {};

        for (const id in updates) {
            const user = updates[id];
            await User.updateOne({ id }, user, { upsert: true });
        }
    }, 60000);
};

scheduleSave();

export { getUser, updateUser };
