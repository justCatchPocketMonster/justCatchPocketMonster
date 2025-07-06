import mongoose from 'mongoose';
import {SaveAllPokemonType} from "../types/SaveAllPokemonType";
import {SaveOnePokemonSchema} from "./SaveOnePokemon";




export const SaveAllPokemonSchema = new mongoose.Schema<SaveAllPokemonType>({

    data: {
        type: mongoose.Schema.Types.Map,
        of: SaveOnePokemonSchema,
        required: true,
    }
}, {
    _id: false,
    timestamps: false
});

