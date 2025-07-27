import NodeCache from "node-cache";
import { Server as ServerModel } from "../core/schemas/Server";
import { Server } from "../core/classes/Server";
import { type ServerType } from "../core/types/ServerType";

const cache = new NodeCache({ stdTTL: 600 });

export async function getServerById(serverId: string): Promise<Server> {
  const cached = cache.get<Server>(serverId);
  if (cached) return cached;

  const data = await ServerModel.findOne({ discordId: serverId }).lean<ServerType>();
  if (!data) {
    const defaultServer = Server.createDefault(serverId);
    cache.set(serverId, defaultServer);
    await updateServer(serverId, defaultServer)
    return defaultServer;
  }

  const server = Server.fromMongo(data);
  cache.set(serverId, server);
  return server;
}

export async function updateServer(
  serverId: string,
  update: Partial<ServerType>,
): Promise<Server> {
  const updated = await ServerModel.findOneAndUpdate(
      { discordId: serverId },
      { $set: { ...update, discordId: serverId } },
      { upsert: true, new: true }
  ).lean<ServerType>();

  const server = Server.fromMongo(updated);
  cache.set(serverId, server);
  return server;
}
