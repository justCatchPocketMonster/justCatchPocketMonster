import mongoose from 'mongoose';
import UserType from '../types/UserType';



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
            savePokemon: [{
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

const User = mongoose.model<UserType>('User', UserSchema);

export default User;
    