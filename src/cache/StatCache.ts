import NodeCache from "node-cache";
import { Stat as StatModel } from "../core/schemas/Stat";
import { Stat } from "../core/classes/Stat";
import { type StatType } from "../core/types/StatType";

const cache = new NodeCache({ stdTTL: 600 });

export async function getStatById(statVersion: string): Promise<Stat> {
  const cached = cache.get<Stat>(statVersion);
  if (cached) return cached;

  const data = await StatModel.findOne({ version: statVersion }).lean<StatType>();
  if (!data) {
    const defaultStat = Stat.createDefault(statVersion);
    cache.set(statVersion, defaultStat);
    await updateStat(statVersion, defaultStat)
    return defaultStat;
  }

  const stat = Stat.fromMongo(data);
  cache.set(statVersion, stat);
  return stat;
}


export async function updateStat(
    statVersion: string,
    update: Partial<StatType>,
): Promise<Stat> {
  const updated = await StatModel.findOneAndUpdate(
      { version: statVersion },
      { $set: { ...update, version: statVersion } },
      { upsert: true, new: true }
  ).lean<StatType>();

  const server = Stat.fromMongo(updated);
  cache.set(statVersion, server);
  return server;
}
