import mongoose from 'mongoose';
import ServerType from '../types/ServerType';
import Pokemon from './Pokemon';



const ServerSchema = new mongoose.Schema<ServerType>({
        
        id: {
            type: String,
            required: true,
        },
        channelAllowed: {
            type: [String],
            required: true,
        },
        charmeChroma: {
            type: Boolean,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        save: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SaveOnePokemon',
            required: true,
        }],
        eventSpawn: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'EventSpawn',
            required: true,
        }],
        maxMessageForRandom: {
            type: Number,
            required: true,
        },
        minMessageForRandom: {
            type: Number,
            required: true,
        },
        maxCountMessage: {
            type: Number,
            required: true,
        },
        countMessage: {
            type: Number,
            required: true,
        },
        pokemonPresent: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'EventSpawn',
        }],

    
}, {
    timestamps: true
});

const GameImage = mongoose.model<ServerType>('Server', ServerSchema);

export default GameImage;
    