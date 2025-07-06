import mongoose from 'mongoose';
import {UserType} from '../types/UserType';
import {SaveOnePokemonSchema} from "./SaveOnePokemon";
import {SaveAllPokemonType} from "../types/SaveAllPokemonType";
import {SaveAllPokemonSchema} from "./SaveAllPokemon";



const UserSchema = new mongoose.Schema<UserType>({
            
            id: {
                type: String,
                required: true,
            },
            enteredCode: [
                {
                    type: String,
                    required: true,
                }
            ],
            savePokemon: {
                type: SaveAllPokemonSchema,
                required: true,
            },
            countPagination: {
                type: Number,
                required: true,
            },

    
}, {
    timestamps: true
});

export const User = mongoose.model<UserType>('User', UserSchema);

    