import mongoose from 'mongoose';

const dbHost: string = process.env.host || 'localhost';
const dbPort: string = process.env.dbPort || '27017';
const dbName: string = process.env.dbName || 'timetubetracker';

const dbURI: string = `mongodb://${dbHost}:${dbPort}/${dbName}`;


async function dbConnect() {
    await mongoose.connect(dbURI);
}

export const dbConnection = mongoose.connection;
export default dbConnect;
