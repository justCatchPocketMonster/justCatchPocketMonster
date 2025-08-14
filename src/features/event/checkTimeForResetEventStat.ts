import { updateServer } from "../../cache/ServerCache";
import { EventSpawn } from "../../core/classes/EventSpawn";
import {ServerType} from "../../core/types/ServerType";


export async function checkTimeForResetEventStat(server: ServerType): Promise<void> {

  if (
    !server.eventSpawn.whatEvent?.endTime
  )
    return;

  const dateNow = new Date();
  const dateEnd = new Date(server.eventSpawn.whatEvent.endTime);
  if (dateNow > dateEnd) {
    server.eventSpawn = EventSpawn.createDefault();
    await updateServer(server.discordId, server);
  }
}
