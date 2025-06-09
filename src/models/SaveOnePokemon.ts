import mongoose from 'mongoose';
import SaveOnePokemonType from '../types/SaveOnePokemonType';



const SaveOnePokemonSchema = new mongoose.Schema<SaveOnePokemonType>({
    
    idPokemon: {
        type: Number,
        required: true,
    },
    form: {
        type: String,
        required: true,
    },
    versionForm: {
        type: Number,
        required: true,
    },
    catch: {
        type: Number,
        required: true,
    },
    shiny: {
        type: Number,
        required: true,
    },
    
}, {
    timestamps: true
});

const SaveOnePokemon = mongoose.model<SaveOnePokemonType>('SaveOnePokemon', SaveOnePokemonSchema);

export default SaveOnePokemon;
    