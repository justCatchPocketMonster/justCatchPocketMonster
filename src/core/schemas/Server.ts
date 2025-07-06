import mongoose from 'mongoose';
import {ServerType} from '../types/ServerType';
import {SaveOnePokemonSchema} from "./SaveOnePokemon";
import {PokemonSchema} from "./Pokemon";
import {EventSpawnSchema} from "./EventSpawn";
import {SaveAllPokemonSchema} from "./SaveAllPokemon";



const ServerSchema = new mongoose.Schema<ServerType>({
        
        id: {
            type: String,
            required: true,
        },
        channelAllowed: {
            type: [String],
            required: true,
            default: [],
        },
        charmeChroma: {
            type: Boolean,
            required: true,
            default: false,
        },
        language: {
            type: String,
            required: true,
            default: "eng",
        },
        savePokemon: {
            type: mongoose.Schema.Types.Map,
            of: SaveOnePokemonSchema,
            required: true,
        },
        eventSpawn: {
            type: EventSpawnSchema,
            required: true,
        },
        maxCountMessage: {
            type: Number,
            required: true,
            default: 0,
        },
        countMessage: {
            type: Number,
            required: true,
            default: 0,
        },
        pokemonPresent: {
            type: SaveAllPokemonSchema,
            required: true,
        },
}, {
    timestamps: true
});

export const Server = mongoose.model<ServerType>('Server', ServerSchema);

    