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
        required: true,
        unique: true,
        minlength: [4, 'Username must be at least 4 characters long'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Email address must be a valid email address']
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    favorites: [{ type: String, unique: true }]
});

// userSchema.post('save', function() {
// this.favorites = [...new Set(this.favorites)];
// });

const User = model<IUser>('User', userSchema);

export default User;
