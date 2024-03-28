import express, { Express } from 'express';
import ms from 'ms';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { log } from 'hlputils';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/api';
import indexRouter from './routes/index';
import Middleware from './utils/middleware';

dotenv.config();
const { port } = process.env;
const authMiddleware = Middleware.auth;

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);

app.use(
  rateLimit({
    windowMs: ms('1m'),
    limit: 100,
    message: { error: 'Too many requests. Please try again later' },
  }),
);

app.use('/static', express.static(path.join(__dirname, '/static')));
app.use(
  '/static/node_modules',
  express.static(path.join(__dirname, '../node_modules/')),
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.listen(port, () => {
  log(`Server is running on port ${port}.`);
});
