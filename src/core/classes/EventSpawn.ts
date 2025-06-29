import { Event } from './Event';
import {EventSpawnType, genStat, rarityStat, typeStat} from '../types/EventSpawnType';

export class EventSpawn implements EventSpawnType {
    constructor(
        public gen: genStat,
        public type: typeStat,
        public rarity: rarityStat,
        public shiny: number,
        public endTime: Date | null,
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
}
