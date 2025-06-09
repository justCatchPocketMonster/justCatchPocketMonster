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
    savePokemon: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SaveOnePokemon',
        required: true
    }],
}, {
    timestamps: true
});

const Stat = mongoose.model<StatType>('Stat', StatSchema);

export default Stat;
    