import EventType from "./EventType";

class genStat {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
    "6": number;
    "7": number;
    "8": number;
    "9": number;

    constructor(
        gen1: number = 0,
        gen2: number = 0,
        gen3: number = 0,
        gen4: number = 0,
        gen5: number = 0,
        gen6: number = 0,
        gen7: number = 0,
        gen8: number = 0,
        gen9: number = 0
    ) {
        this["1"] = gen1;
        this["2"] = gen2;
        this["3"] = gen3;
        this["4"] = gen4;
        this["5"] = gen5;
        this["6"] = gen6;
        this["7"] = gen7;
        this["8"] = gen8;
        this["9"] = gen9;
    }
}

class typeStat {
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

    constructor(
        steel: number = 0,
        dragon: number = 0,
        electric: number = 0,
        fire: number = 0,
        bug: number = 0,
        grass: number = 0,
        psychic: number = 0,
        ground: number = 0,
        dark: number = 0,
        fighting: number = 0,
        water: number = 0,
        fairy: number = 0,
        ice: number = 0,
        normal: number = 0,
        poison: number = 0,
        rock: number = 0,
        ghost: number = 0,
        flying: number = 0
    ) {
        this.Steel = steel;
        this.Dragon = dragon;
        this.Electric = electric;
        this.Fire = fire;
        this.Bug = bug;
        this.Grass = grass;
        this.Psychic = psychic;
        this.Ground = ground;
        this.Dark = dark;
        this.Fighting = fighting;
        this.Water = water;
        this.Fairy = fairy;
        this.Ice = ice;
        this.Normal = normal;
        this.Poison = poison;
        this.Rock = rock;
        this.Ghost = ghost;
        this.Flying = flying;
    }
}

class rarityStat {
    "ordinaire": number;
    "legendaire": number;
    "fabuleux": number;

    constructor(
        ordinaire: number = 0,
        legendaire: number = 0,
        fabuleux: number = 0
    ) {
        this.ordinaire = ordinaire;
        this.legendaire = legendaire;
        this.fabuleux = fabuleux;
    }
}

class EventSpawnType {
    _id: string;
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

    constructor(
        _id: string,
        gen: genStat = new genStat(),
        type: typeStat = new typeStat(),
        rarity: rarityStat = new rarityStat(),
        shiny: number = 0,
        endTime: Date|null = null,
        whatEvent: EventType|null = null,
        allowedForm: { mega: boolean, giga: boolean } = { mega: true, giga: true },
        messageSpawn: { min: number, max: number } = { min: 1, max: 5 },
        nightMode: boolean = false,
        valeurMaxChoiceEgg: number = 10
    ) {
        this._id = _id;
        this.gen = gen;
        this.type = type;
        this.rarity = rarity;
        this.shiny = shiny;
        this.endTime = endTime;
        this.whatEvent = whatEvent;
        this.allowedForm = allowedForm;
        this.messageSpawn = messageSpawn;
        this.nightMode = nightMode;
        this.valeurMaxChoiceEgg = valeurMaxChoiceEgg;
    }
}

export default EventSpawnType;