import express, { Express } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { log } from 'hlputils';
import cookieParser from 'cookie-parser';
import indexRouter from './routes/index';
import apiRouter from './routes/api';

dotenv.config();

const app: Express = express();

const { port } = process.env;

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.listen(port, () => {
  log(`Server is running on port ${port}.`);
});
