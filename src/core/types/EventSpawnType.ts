import EventType from "./EventType";

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
    "Steel": number;
    "Dragon": number;
    "Electric": number;
    "Fire": number;
    "Bug": number;
    "Grass": number;
    "Psychic": number;
    "Ground": number;
    "Dark": number;
    "Fighting": number;
    "Water": number;
    "Fairy": number;
    "Ice": number;
    "Normal": number;
    "Poison": number;
    "Rock": number;
    "Ghost": number;
    "Flying": number

}

export interface rarityStat {
    "ordinaire": number;
    "legendaire": number;
    "fabuleux": number;

}

export interface EventSpawnType {
    gen: genStat;
    type: typeStat;
    rarity: rarityStat;
    "shiny": number;
    "endTime": Date|null;
    "whatEvent": EventType|null;
    "allowedForm": {
        "mega": boolean,
        "giga": boolean
    };
    "messageSpawn": {
        "min": number,
        "max": number
    };
    "nightMode": boolean;
    "valeurMaxChoiceEgg": number

}
