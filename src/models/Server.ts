import mongoose from 'mongoose';
import ServerType from '../types/ServerType';



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
        savePokemon: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SaveOnePokemon',
            required: true,
        }],
        eventSpawn: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'EventSpawn',
            required: true,
        },
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
            default: 0,
        },
        countMessage: {
            type: Number,
            required: true,
            default: 0,
        },
        pokemonPresent: [{
            id: { type: Number, required: true },
            name: {
                nameFr: { type: [String], required: true },
                nameEng: { type: [String], required: true },
            },
            arrayType: { type: [String], required: true },
            rarity: { type: String, required: true },
            imgName: { type: String, required: true },
            gen: { type: Number, required: true },
            form: { type: String, required: true },
            versionForm: { type: Number, required: true },
            isShiny: { type: Boolean, required: true },
            idChannel: { type: String, required: true },
            idServer: { type: String, required: true },
        }],

    
}, {
    timestamps: true
});

const Server = mongoose.model<ServerType>('Server', ServerSchema);

export default Server;
    