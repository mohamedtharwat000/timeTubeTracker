import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import router from './routes/index';

dotenv.config();
const app = express();
const port = process.env.port || 3001;

app.use(express.json());
app.use(cookieParser());

app.use('/', router);

app.listen(port, () => console.log(`Server is running on port ${port} now`));
