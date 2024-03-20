import express, { Express } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import apiRouter from './routes/api';
import router from './routes/index';

const app: Express = express();

const port = process.env.port || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));

app.use('/', router);
app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
