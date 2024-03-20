import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { log } from 'hlputils';

dotenv.config();

const { dbHost } = process.env;
const { dbPort } = process.env;
const { dbName } = process.env;

const dbURI = `mongodb://${dbHost}:${dbPort}/${dbName}`;

mongoose
  .connect(dbURI)
  .then(() => {
    log('Connected To database.');
  })
  .catch((err) => log(err));

export default mongoose.connection;
