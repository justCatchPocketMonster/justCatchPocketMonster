import mongoose from 'mongoose';
import EventSpawnType from '../types/EventSpawnType';
import defaultValue from '../defaultValue';
import Event from './Event';



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
        default: defaultValue.defaultValueGen[1]
    },
    "2": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueGen[2]
    },
    "3": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueGen[3]
    },
    "4": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueGen[4]
    },
    "5": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueGen[5]
    },
    "6": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueGen[6]
    },
    "7": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueGen[7]
    },
    "8": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueGen[8]
    },
    "9": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueGen[9]
    },
},
type: {
    "acier": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.acier
    },
    "dragon": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.dragon
    },
    "electrik": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.electrik
    },
    "feu": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.feu
    },
    "insecte": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.insecte
    },
    "plante": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.plante
    },
    "psy": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.psy
    },
    "sol": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.sol
    },
    "tenebres": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.tenebres
    },
    "combat": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.combat
    },
    "eau": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.eau
    },
    "fee": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.fee
    },
    "glace": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.glace
    },
    "normal": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.normal
    },
    "poison": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.poison
    },
    "roche": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.roche
    },
    "spectre": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.spectre
    },
    "vol": {
        type: Number,
        required: true,
        default: defaultValue.defaultValueType.vol
    },
},
rarity: {
    "normal": {
        type: Number,
        required: true,
        default: defaultValue.defaultRarity.normal
    },
    "legendaire": {
        type: Number,
        required: true,
        default: defaultValue.defaultRarity.legendaire
    },
    "fabuleux": {
        type: Number,
        required: true,
        default: defaultValue.defaultRarity.fabuleux
    },
},
shiny: {
    type: Number,
    required: true,
    default: defaultValue.tauxMaxShiny,
},
timer: {
    type: String,
    required: true,
    default: "",
},
whatEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
},
allowForm: {
    mega: {
        type: Boolean,
        required: true,
    },
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
},
}, {
    timestamps: true
});

const GameImage = mongoose.model<EventSpawnType>('EventSpawn', EventSpawnSchema);

export default GameImage;
    