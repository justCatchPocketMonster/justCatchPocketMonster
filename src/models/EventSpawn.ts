import mongoose from 'mongoose';
import EventSpawnType from '../types/EventSpawnType';
import {defaultValueGen, defaultValueType, defaultRarity, tauxMaxShiny} from '../defaultValue';



const EventSpawnSchema = new mongoose.Schema<EventSpawnType>({
id: {
    type: String,
    required: true,
    default: "",
},
gen: {
    "1": {
        type: Number,
        required: true,
        default: defaultValueGen[1]
    },
    "2": {
        type: Number,
        required: true,
        default: defaultValueGen[2]
    },
    "3": {
        type: Number,
        required: true,
        default: defaultValueGen[3]
    },
    "4": {
        type: Number,
        required: true,
        default: defaultValueGen[4]
    },
    "5": {
        type: Number,
        required: true,
        default: defaultValueGen[5]
    },
    "6": {
        type: Number,
        required: true,
        default: defaultValueGen[6]
    },
    "7": {
        type: Number,
        required: true,
        default: defaultValueGen[7]
    },
    "8": {
        type: Number,
        required: true,
        default: defaultValueGen[8]
    },
    "9": {
        type: Number,
        required: true,
        default: defaultValueGen[9]
    },
},
type: {
    "acier": {
        type: Number,
        required: true,
        default: defaultValueType.acier
    },
    "dragon": {
        type: Number,
        required: true,
        default: defaultValueType.dragon
    },
    "electrik": {
        type: Number,
        required: true,
        default: defaultValueType.electrik
    },
    "feu": {
        type: Number,
        required: true,
        default: defaultValueType.feu
    },
    "insecte": {
        type: Number,
        required: true,
        default: defaultValueType.insecte
    },
    "plante": {
        type: Number,
        required: true,
        default: defaultValueType.plante
    },
    "psy": {
        type: Number,
        required: true,
        default: defaultValueType.psy
    },
    "sol": {
        type: Number,
        required: true,
        default: defaultValueType.sol
    },
    "tenebres": {
        type: Number,
        required: true,
        default: defaultValueType.tenebres
    },
    "combat": {
        type: Number,
        required: true,
        default: defaultValueType.combat
    },
    "eau": {
        type: Number,
        required: true,
        default: defaultValueType.eau
    },
    "fee": {
        type: Number,
        required: true,
        default: defaultValueType.fee
    },
    "glace": {
        type: Number,
        required: true,
        default: defaultValueType.glace
    },
    "normal": {
        type: Number,
        required: true,
        default: defaultValueType.normal
    },
    "poison": {
        type: Number,
        required: true,
        default: defaultValueType.poison
    },
    "roche": {
        type: Number,
        required: true,
        default: defaultValueType.roche
    },
    "spectre": {
        type: Number,
        required: true,
        default: defaultValueType.spectre
    },
    "vol": {
        type: Number,
        required: true,
        default: defaultValueType.vol
    },
},
rarity: {
    "normal": {
        type: Number,
        required: true,
        default: defaultRarity.normal
    },
    "legendaire": {
        type: Number,
        required: true,
        default: defaultRarity.legendaire
    },
    "fabuleux": {
        type: Number,
        required: true,
        default: defaultRarity.fabuleux
    },
},
shiny: {
    type: Number,
    required: true,
    default: tauxMaxShiny,
},
endTime: {
    type: Date,
    required: true,
    default: Date.now,
},
whatEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
},
    allowedForm: {
        mega: {
            type: Boolean,
            required: true,
            default: false
        },
        giga: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    messageSpawn: {
        min: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
    },
    nightMode: {
        type: Boolean,
        required: true,
    },
    valeurMaxChoiceEgg: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
});

const GameImage = mongoose.model<EventSpawnType>('EventSpawn', EventSpawnSchema);

export default GameImage;
    