import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import apiRouter from './routes/api';
import router from './routes/index';
import helmet from 'helmet';
import dbConnect from './models/storage/db';
import redisClient from './models/storage/redis';

const app: Express = express();
const port = process.env.port || 3000;

dbConnect().then(
    () => console.log('Connected to DB'),
    () => console.log('Failed connecting to DB'));

redisClient.connect().then(
    () => console.log('Connected to Redis'),
    () => console.log('Failed connecting to Redis'));

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));

app.use('/', router);
app.use('/api', apiRouter);


app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
