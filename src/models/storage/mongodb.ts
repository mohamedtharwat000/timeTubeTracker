import mongoose from 'mongoose';
import { log } from 'hlputils';

const dbHost: string = process.env.host || 'localhost';
const dbPort: string = process.env.dbPort || '27017';
const dbName: string = process.env.dbName || 'timetubetracker';

const dbURI = `mongodb://${dbHost}:${dbPort}/${dbName}`;

mongoose
  .connect(dbURI)
  .then(() => {
    log('Connected To database.');
  })
  .catch((err) => log(err));

export default mongoose.connection;
