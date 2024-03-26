import { Schema, model, Document } from 'mongoose';

export interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  favorites: string[];
}

const userSchema = new Schema<UserInterface>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
