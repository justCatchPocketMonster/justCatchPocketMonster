// @ts-ignore
import NodeCache from 'node-cache';
import Server from '../models/Server';
import ServerType from '../types/ServerType';

const serverCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
let serverUpdates: { [id: string]: String } = {};

const getServer = async (id: string): Promise<ServerType> => {
    let serverString:String | undefined = serverCache.get<String>(id);

    if (serverString === undefined || serverString === null) {
        let server = await Server.findOne({ id }).exec();

        if (!server) {
            server = new Server({ id });

        }
        serverCache.set(id, JSON.stringify(server));
        serverString = serverCache.get<String>(id);
    }

    if (serverString === undefined) {
        throw new Error("serverString est undefined, impossible de parser.");
    }

    return JSON.parse(serverString as string);
};

const updateServer = (id: string, data: ServerType) => {

    serverUpdates[id] = JSON.stringify(data);
    serverCache.set(id, JSON.stringify(data));
};

const scheduleSave = () => {
    setInterval(async () => {
        const updates: { [id: string]: ServerType } = {} = {}
        for (const id in serverUpdates) {
            updates[id] = JSON.parse(serverUpdates[id] as string);
        }

        serverUpdates = {};

        for (const id in updates) {
            const server = updates[id];
            await Server.updateOne({ id }, server, { upsert: true });
        }
    }, 60000);
};

scheduleSave();

export { getServer, updateServer };
