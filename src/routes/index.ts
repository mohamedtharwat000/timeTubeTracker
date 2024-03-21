import express, { Router, Request, Response } from 'express';
import Middleware from '../utils/middleware';

const indexRouter: Router = express.Router();

indexRouter.get('*', Middleware.auth);
indexRouter.get('/', (_req: Request, res: Response) => {
  res.render('home', { title: 'Home' });
});

export default indexRouter;
