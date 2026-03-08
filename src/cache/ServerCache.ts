import NodeCache from "node-cache";
import { Server as ServerModel } from "../core/schemas/Server";
import { Server } from "../core/classes/Server";
import { type ServerType } from "../core/types/ServerType";
import { ttlCache } from "../config/default/misc";

export const cache = new NodeCache({ stdTTL: ttlCache });

export async function getServerById(serverId: string): Promise<Server> {
  const safeServerId = String(serverId);
  const cached = cache.get<Server>(safeServerId);
  if (cached) return cached;

  const data = await ServerModel.findOne({
    discordId: safeServerId,
  }).lean<ServerType>();
  if (!data) {
    const defaultServer = Server.createDefault(safeServerId);
    cache.set(safeServerId, defaultServer);
    await updateServer(safeServerId, defaultServer);
    return defaultServer;
  }

  const server = Server.fromMongo(data);
  cache.set(safeServerId, server);
  return server;
}

export async function updateServer(
  serverId: string,
  update: ServerType,
): Promise<Server> {
  const safeServerId = String(serverId);
  cache.set(safeServerId, update);
  await ServerModel.findOneAndUpdate(
    { discordId: safeServerId },
    { $set: { ...update, discordId: safeServerId } },
    { upsert: true, new: true },
  ).lean<ServerType>();

  return update as Server;
}
