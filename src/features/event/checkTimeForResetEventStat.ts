import { updateServer, getServerById } from "../../cache/ServerCache";
import { EventSpawn } from "../../core/classes/EventSpawn";

export async function checkTimeForResetEventStat(serverId: string): Promise<void> {
  // @ts-ignore
  const server = await getServerById(serverId);
  if (
    !server.eventSpawn ||
    !server.eventSpawn.whatEvent ||
    !server.eventSpawn.whatEvent.endTime
  )
    return;

  const dateNow = new Date();
  const dateEnd = new Date(server.eventSpawn.whatEvent.endTime);
  if (dateNow > dateEnd) {
    server.eventSpawn = EventSpawn.createDefault();
    await updateServer(serverId, server);
  }
}
