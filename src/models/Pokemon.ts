import mongoose from 'mongoose';
import PokemonType from '../types/PokemonType';



const PokemonSchema = new mongoose.Schema<PokemonType>({
    id: {
        type: Number,
        required: true,
    },
    name: {
        nameEng: {
            type: String,
            required: true,
        },
        nameFr: {
            type: String,
            required: true,
        },
    },
    arrayType: {
        type: [String],
        required: true,
    },
    rarity: {
        type: String,
        required: true,
    },
    imgName: {
        type: String,
        required: true,
    },
    gen: {
        type: Number,
        required: true,
    },
    form: {
        type: String,
        required: true,
    },
    versionForm: {
        type: Number,
        required: true,
    },
    idChannel: {
        type: String,
        required: false,
    },

}, {
    timestamps: true
});

const GameImage = mongoose.model<PokemonType>('Pokemon', PokemonSchema);

export default GameImage;
    