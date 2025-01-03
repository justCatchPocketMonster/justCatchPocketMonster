// @ts-ignore
import NodeCache from 'node-cache';
import User from '../models/User';
import UserType from '../types/UserType';
import {ttlAllData} from "../defaultValue";
import ServerType from "../types/ServerType";
import SaveOnePokemon from "../models/SaveOnePokemon";
import EventSpawn from "../models/EventSpawn";
import Server from "../models/Server";

const userCache = new NodeCache({ stdTTL: ttlAllData, checkperiod: 10 });

const getUser = async (id: string): Promise<UserType> => {
    let userFromCache:UserType | undefined = userCache.get<UserType>(id);
    console.log(id)

    if (userFromCache === undefined || userFromCache === null) {
        let user = await User.findOne({ id }).exec();
        
        if (!user) {
            user = new User({ id });
            
        }
        userCache.set(id, user);
        userFromCache = userCache.get<UserType>(id);
    }

    if (userFromCache === undefined) {
        throw new Error("userString est undefined, impossible de parser.");
    }
    return userFromCache;
};

const updateUser = (id: string, data: UserType) => {

    userCache.set(id, JSON.stringify(data));
};

// @ts-ignore
userCache.on('expired', async (key: String, value: UserType) => {

    try {
        const user : UserType = value;
        for (const pokemonSave of user.savePokemon) {
            await SaveOnePokemon.updateOne({ _id: pokemonSave._id }, pokemonSave, { upsert: true });
        }

        console.log(`Serveur ${user.id} traité et sauvegardé.`);
    } catch (error) {
        console.error('Erreur lors du traitement des données expirées :', error);
    }
});


export { getUser, updateUser };
