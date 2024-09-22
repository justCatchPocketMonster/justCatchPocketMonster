import mongoose from 'mongoose';
import UserType from '../types/UserType';
import Pokemon from './Pokemon';



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
            save: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Pokemon',
                required: true,
            }],
            countPagination: {
                type: Number,
                required: true,
            },

    
}, {
    timestamps: true
});

const GameImage = mongoose.model<UserType>('User', UserSchema);

export default GameImage;
    