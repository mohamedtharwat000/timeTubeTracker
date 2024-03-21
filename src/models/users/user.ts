import { Schema, model } from 'mongoose';
import { isEmail } from 'validator';
import UserInterface from './userInterface';

const userSchema = new Schema<UserInterface>({
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
    validate: [isEmail, 'Email address must be a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  favorites: {
    type: [String],
    default: [],
  },
});

const User = model<UserInterface>('User', userSchema);

export default User;
