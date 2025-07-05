import {updateServer, getServerById} from "../../cache/ServerCache";
import {EventSpawn} from "../../core/classes/EventSpawn";


export default function checkTimeForResetEventStat(serverId: string): void {
    // @ts-ignore
    const server = await getServerById(serverId);
    if (!server.eventSpawn || !server.eventSpawn.endTime) return;

    const dateNow = new Date();
    const dateEnd = new Date(server.eventSpawn.endTime);
    console.log(dateEnd, dateEnd, dateNow > dateEnd);
    if (dateNow > dateEnd) {
        server.eventSpawn = EventSpawn.createDefault()
        updateServer(serverId, server);
    }

}