import mongoose from 'mongoose';

const dbHost: string = process.env.host || 'localhost';
const dbPort: string = process.env.dbPort || '27017';
const dbName: string = process.env.dbName || 'timetubetracker';

const dbURI: string = `mongodb://${dbHost}:${dbPort}/${dbName}`;


mongoose.connect(dbURI)
    .then(() => {
        console.log('Connected To database.');
    })
    .catch(err => console.log('error', err));

export default mongoose.connection;
