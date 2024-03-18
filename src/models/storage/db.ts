import mongoose from 'mongoose';

const dbHost = process.env.host || 'localhost';
const dbPort = process.env.dbPort || '27017';
const dbName = process.env.dbName || 'timetubetracker';

const dbURI = `mongodb://${dbHost}:${dbPort}/${dbName}`;


mongoose.connect(dbURI)
    .then(() => {
        console.log('Connected To database.');
    })
    .catch(err => console.log('error', err));

export default mongoose.connection;
