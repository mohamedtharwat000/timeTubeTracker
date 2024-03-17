import express from 'express';
import cookie_parser from 'cookie-parser';

const app = express();
const port = process.env.port || 5000;

app.use(express.json());
app.use(cookie_parser());


app.listen(port);
