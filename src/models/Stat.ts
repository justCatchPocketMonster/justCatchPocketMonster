import mongoose from 'mongoose';
import StatType from '../types/StatType';

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
    save: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SaveOnePokemon',
        required: true
    }],
}, {
    timestamps: true
});

const GameImage = mongoose.model<StatType>('Stat', StatSchema);

export default GameImage;
    