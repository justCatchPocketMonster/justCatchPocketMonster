import NodeCache from 'node-cache';
import { Stat as StatModel } from '../core/schemas/Stat';
import { Stat } from '../core/classes/Stat';
import { type StatType } from '../core/types/StatType';

const cache = new NodeCache({ stdTTL: 600 });

export async function getStatById(statVersion: string): Promise<Stat | null> {
    const cached = cache.get<Stat>(statVersion);
    if (cached) return cached;

    const data = await StatModel.findOne({ statVersion }).lean<StatType>();
    if (!data) return null;

    const stat = Stat.fromMongo(data);
    cache.set(statVersion, stat);
    return stat;
}

export async function updateStat(statVersion: string, update: Partial<StatType>): Promise<Stat | null> {
    const updated = await StatModel.findOneAndUpdate({ statVersion }, update, { new: true }).lean<StatType>();
    if (!updated) return null;

    const stat = Stat.fromMongo(updated);
    cache.set(statVersion, stat);
    return stat;
}
