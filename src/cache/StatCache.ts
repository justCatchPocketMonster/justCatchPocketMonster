// TODO
/**
// @ts-ignore
import NodeCache from 'node-cache';
import Stat from '../core/schemas/Stat';
import StatType from '../core/types/StatType';
import {ttlAllData} from "../defaultValue";
import ServerType from "../core/types/ServerType";
import SaveOnePokemon from "../core/schemas/SaveOnePokemon";
import EventSpawn from "../core/schemas/EventSpawn";
import Server from "../core/schemas/Server";

const statCache = new NodeCache({ stdTTL: ttlAllData, checkperiod: 10 });

const getStat = async (version: string): Promise<StatType> => {
    let statFromCache:StatType | undefined = statCache.get<StatType>(version);
    console.log(version)

    if (statFromCache === undefined || statFromCache === null) {
        let stat = await Stat.findOne({ version }).exec();

        if (!stat) {
            stat = new Stat({ version });

        }
        statCache.set(version, stat);
        statFromCache = statCache.get<StatType>(version);
    }

    if (statFromCache === undefined) {
        throw new Error("statString est undefined, impossible de parser.");
    }
    return statFromCache;
};

const updateStat = (version: string, data: StatType) => {

    statCache.set(version, data);
};

// @ts-ignore
statCache.on('expired', async (key: String, value: StatType) => {

    try {
        const stat: StatType = value;
        for (const pokemonSave of stat.savePokemon) {
            await SaveOnePokemon.updateOne({ _id: pokemonSave._id }, pokemonSave, { upsert: true });
        }

        console.log(`stat ${stat.version} traité et sauvegardé.`);
    } catch (error) {
        console.error('Erreur lors du traitement des données expirées :', error);
    }
});


export { getStat, updateStat };
**/