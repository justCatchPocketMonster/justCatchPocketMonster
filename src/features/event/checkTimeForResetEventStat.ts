import defaultEventStat from "./defaultEventStat";
import {updateServer, getServer} from "../../cache/ServerCache";
import {CacheType, CacheTypeReducer} from "discord.js";


export default function checkTimeForResetEventStat(serverId: string): void {
    // @ts-ignore
    const server = getServer(serverId) as ServerType;
    console.log(server.eventSpawn)
    console.log(server.eventSpawn.endTime)
    console.log(server.eventSpawn)

    if (!server.eventSpawn || !server.eventSpawn.endTime) return;

    const dateNow = new Date();
    const dateEnd = new Date(server.eventSpawn.endTime);
    console.log(dateEnd, dateEnd, dateNow > dateEnd);
    if (dateNow > dateEnd) {
        server.eventSpawn = {
            ...defaultEventStat(),
            _id: server.eventSpawn._id
        }
        updateServer(serverId, server);
    }

}