import express, { Express } from 'express';
import ms from 'ms';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { log } from 'hlputils';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import apiRouter from './routes/api';
import indexRouter from './routes/index';
import Middleware from './utils/middleware';

dotenv.config();

const app: Express = express();

const { port } = process.env;

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());

app.use(mongoSanitize());

app.use(
  rateLimit({
    windowMs: ms('1m'),
    limit: 10,
    message: { error: 'Too many requests. Please try again later' },
  }),
);

const authMiddleware = Middleware.auth;
app.use(authMiddleware);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/static')));
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.listen(port, () => {
  log(`Server is running on port ${port}.`);
});
