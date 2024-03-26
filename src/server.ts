import express, { Express } from 'express';
import ms from 'ms';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { log } from 'hlputils';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import apiRouter from './routes/api';
import indexRouter from './routes/index';
import Middleware from './utils/middleware';

dotenv.config();
const { port } = process.env;
const authMiddleware = Middleware.auth;

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(authMiddleware);

app.use(mongoSanitize());
app.use(
  rateLimit({
    windowMs: ms('1m'),
    limit: 300,
    message: { error: 'Too many requests. Please try again after 1 minutes' },
  }),
);

app.use('/static', express.static(path.join(__dirname, 'static')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  '/static/css',
  express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')),
  express.static(path.join(__dirname, '../node_modules/bootstrap-icons/font')),
  express.static(path.join(__dirname, '../node_modules/bootstrap-icons/icons')),
);
app.use(
  '/static/js',
  express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')),
);

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.listen(port, () => {
  log(`Server is running on port ${port}.`);
});
