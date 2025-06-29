import mongoose from 'mongoose';
import {UserType} from '../types/UserType';
import {SaveOnePokemonSchema} from "./SaveOnePokemon";



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
                type: mongoose.Schema.Types.Map,
                of: SaveOnePokemonSchema,
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

    