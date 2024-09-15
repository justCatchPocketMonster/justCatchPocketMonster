import mongoose from 'mongoose';
import EventType from '../types/EventType';



const gameImageSchema = new mongoose.Schema<EventType>({
    id: {
        type: String,
        required: true,
        default: "",
    },
    nom: {
        type: String,
        required: true,
        default: "",
    },
    description: {
        type: String,
        required: true,
        default: "",
    },
    type: {
        type: String,
        required: true,
        default: "",
    },
    color: {
        type: String,
        required: true,
        default: "",
    },
    image: {
        type: String,
        required: true,
        default: "",
    },
    rarity: {
        type: String,
        required: true,
        default: "",
    },
    quand: {
        type: String,
        required: true,
        default: "",
    },

}, {
    timestamps: true
});

const GameImage = mongoose.model<EventType>('Event', gameImageSchema);

export default GameImage;
    