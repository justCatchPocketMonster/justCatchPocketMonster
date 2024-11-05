import EventType from "./EventType";

interface EventSpawnType {
    id: string;
    gen: {
        "1": number;
        "2": number;
        "3": number;
        "4": number;
        "5": number;
        "6": number;
        "7": number;
        "8": number;
        "9": number;
    };
    type: {
        "acier": number,
        "dragon": number,
        "electrik": number,
        "feu": number,
        "insecte": number,
        "plante": number,
        "psy": number,
        "sol": number,
        "tenebres": number,
        "combat": number,
        "eau": number,
        "fee": number,
        "glace": number,
        "normal": number,
        "poison": number,
        "roche": number,
        "spectre": number,
        "vol": number
    },
    rarity: {
        "normal": number,
        "legendaire": number,
        "fabuleux": number
    },
    "shiny": number,
    "timer": string,
    "whatEvent": EventType|null,
    "allowedForm": {
        "mega": boolean,
        "paldea": boolean
    },
    "messageSpawn": {
        "min": number,
        "max": number
    },
    "nightMode": boolean,
    "valeurMaxChoiceEgg": number
}

export default EventSpawnType;