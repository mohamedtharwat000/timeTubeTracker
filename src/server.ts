import express, { Express } from 'express';
import helmet from 'helmet';
import { log } from 'hlputils';
import cookieParser from 'cookie-parser';
import indexRouter from './routes/index';
import apiRouter from './routes/api';

const app: Express = express();

const port: string = process.env.port || '3000';

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.listen(port, () => {
  log(`Server is running on port ${port}.`);
});
