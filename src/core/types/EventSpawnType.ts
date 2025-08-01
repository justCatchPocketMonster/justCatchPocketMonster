import {EventType} from "./EventType";

export interface genStat {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
  "6": number;
  "7": number;
  "8": number;
  "9": number;
}

export interface typeStat {
  steel: number;
  dragon: number;
  electric: number;
  fire: number;
  bug: number;
  grass: number;
  psychic: number;
  ground: number;
  dark: number;
  fighting: number;
  water: number;
  fairy: number;
  ice: number;
  normal: number;
  poison: number;
  rock: number;
  ghost: number;
  flying: number;
}

export interface rarityStat {
  ordinary: number;
  legendary: number;
  mythical: number;
}

export interface EventSpawnType {
  gen: genStat;
  type: typeStat;
  rarity: rarityStat;
  shiny: number;
  whatEvent: EventType | null;
  allowedForm: {
    mega: boolean;
    giga: boolean;
  };
  messageSpawn: {
    min: number;
    max: number;
  };
  nightMode: boolean;
  valueMaxChoiceEgg: number;
}
