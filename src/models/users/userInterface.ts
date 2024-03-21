import { Document } from 'mongoose';

interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  createdAt: Date;
  favorites: string[];
}

export default UserInterface;
