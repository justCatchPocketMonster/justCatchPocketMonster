// @ts-ignore
import NodeCache from 'node-cache';
import Stat from '../models/Stat';
import StatType from '../types/StatType';

const statCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
let statUpdates: { [id: string]: String } = {};

const getStat = async (version: string): Promise<StatType> => {
    let statString:String | undefined = statCache.get<String>(version);
    console.log(version)

    if (statString === undefined || statString === null) {
        let stat = await Stat.findOne({ version }).exec();

        if (!stat) {
            stat = new Stat({ version });

        }
        statCache.set(version, JSON.stringify(stat));
        statString = statCache.get<String>(version);
    }

    if (statString === undefined) {
        throw new Error("statString est undefined, impossible de parser.");
    }
    console.log("data:",JSON.parse(statString as string))
    return JSON.parse(statString as string);
};

const updateStat = (version: string, data: StatType) => {

    statUpdates[version] = JSON.stringify(data);
    statCache.set(version, JSON.stringify(data));
};

const scheduleSave = () => {
    setInterval(async () => {
        const updates: { [version: string]: StatType } = {} = {}
        for (const version in statUpdates) {
            updates[version] = JSON.parse(statUpdates[version] as string);
        }

        statUpdates = {};

        for (const version in updates) {
            const stat = updates[version];
            await Stat.updateOne({ version }, stat, { upsert: true });
        }
    }, 60000);
};

scheduleSave();

export { getStat, updateStat };
