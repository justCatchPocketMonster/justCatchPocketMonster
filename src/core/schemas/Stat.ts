import mongoose from 'mongoose';
import {StatType} from '../types/StatType';
import {SaveOnePokemonSchema} from "./SaveOnePokemon";
import {SaveAllPokemonSchema} from "./SaveAllPokemon";

const StatSchema = new mongoose.Schema<StatType>({
    version: {
        type: String,
        required: true,
        unique: true
    },
    pokemonSpawned: {
        type: Number,
        required: true
    },
    pokemonCaught: {
        type: Number,
        required: true
    },
    savePokemonSpawn: {
        type: SaveAllPokemonSchema,
        required: true,
    },
    savePokemonCatch: {
        type: SaveAllPokemonSchema,
        required: true,
    },
}, {
    timestamps: true
});

export const Stat = mongoose.model<StatType>('Stat', StatSchema);

    