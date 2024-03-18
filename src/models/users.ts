import { Schema, model, Document } from 'mongoose';
import isEmail from 'validator/lib/isEmail';


export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    avatar: string;
    createdAt: Date;
    favorites: [string];
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        unique: true,
        minlength: 4,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    favorites: {
        type: [String],
        default: []
    }
});

const User = model<IUser>('User', userSchema);

export default User;
