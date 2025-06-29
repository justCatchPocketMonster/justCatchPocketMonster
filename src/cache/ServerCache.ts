import NodeCache from 'node-cache';
import { Server as ServerModel } from '../core/schemas/Server';
import { Server } from '../core/classes/Server'; // class métier
import { type ServerType } from '../core/types/ServerType'; // type TS

const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

/**
 * Récupère un serveur par ID depuis le cache ou MongoDB.
 */
export async function getServerById(serverId: string): Promise<Server | null> {
    const cached = cache.get<Server>(serverId);
    if (cached) return cached;

    const data = await ServerModel.findOne({ serverId }).lean<ServerType>();
    if (!data) return null;

    const server = Server.fromMongo(data);
    cache.set(serverId, server);
    return server;
}

/**
 * Met à jour un serveur dans MongoDB et le cache.
 */
export async function updateServer(serverId: string, update: Partial<ServerType>): Promise<Server | null> {
    const updated = await ServerModel.findOneAndUpdate({ serverId }, update, { new: true }).lean<ServerType>();
    if (!updated) return null;

    const server = Server.fromMongo(updated);
    cache.set(serverId, server);
    return server;
}
