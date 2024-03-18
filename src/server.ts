import express from 'express';
import cookieParser from 'cookie-parser';
import apiRouter from './routes/api';
import router from './routes/index';

const app = express();
const port = process.env.port || 3001;

app.use(express.json());
app.use(cookieParser());

app.use('/', router);
app.use('/api', apiRouter);
app.use(express.static('static'));
app.use(express.urlencoded({ extended: true }));


app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
