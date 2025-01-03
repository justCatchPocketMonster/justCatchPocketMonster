// @ts-ignore
import NodeCache from 'node-cache';
import Stat from '../models/Stat';
import StatType from '../types/StatType';
import {ttlAllData} from "../defaultValue";
import ServerType from "../types/ServerType";
import SaveOnePokemon from "../models/SaveOnePokemon";
import EventSpawn from "../models/EventSpawn";
import Server from "../models/Server";

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
        const stat : StatType = value;
        for (const pokemonSave of stat.savePokemon) {
            await SaveOnePokemon.updateOne({ _id: pokemonSave._id }, pokemonSave, { upsert: true });
        }

        console.log(`stat ${stat.version} traité et sauvegardé.`);
    } catch (error) {
        console.error('Erreur lors du traitement des données expirées :', error);
    }
});


export { getStat, updateStat };
