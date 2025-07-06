import { Event } from './Event';
import {EventSpawnType, genStat, rarityStat, typeStat} from '../types/EventSpawnType';
import {defaultLanguage} from "../../config/default/server";
import {maximumCount, minimumCount, valuePerGen, valuePerRarity, valuePerType} from "../../config/default/spawn";

export class EventSpawn implements EventSpawnType {
    constructor(
        public gen: genStat,
        public type: typeStat,
        public rarity: rarityStat,
        public shiny: number,
        public whatEvent: Event | null,
        public allowedForm: {
            mega: boolean;
            giga: boolean;
        },
        public messageSpawn: {
            min: number;
            max: number;
        },
        public nightMode: boolean,
        public valeurMaxChoiceEgg: number
    ) {}

    static createDefault(): EventSpawn {
        const defaultEventSpawn = new EventSpawn(
            valuePerGen,
            valuePerType,
            valuePerRarity,
            0,
            null,
            { mega: false, giga: false },
            {
                min: minimumCount,
                max: maximumCount
            },
            false,
            1
        );
        return defaultEventSpawn;
    }
}
