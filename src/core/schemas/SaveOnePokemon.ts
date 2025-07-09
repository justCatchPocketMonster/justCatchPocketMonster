import mongoose from 'mongoose';
import {SaveOnePokemonType} from '../types/SaveOnePokemonType';



export const SaveOnePokemonSchema = new mongoose.Schema<SaveOnePokemonType>({
    
    idPokemon: {
        type: String,
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
    normalCount: {
        type: Number,
        required: true,
    },
    shinyCount: {
        type: Number,
        required: true,
    }
}, {
    _id: false,
    timestamps: false
});

    