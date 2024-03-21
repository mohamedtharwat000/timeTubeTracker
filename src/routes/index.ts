import express, { Router, Request, Response } from 'express';
import Middleware from '../utils/middleware';

const indexRouter: Router = express.Router();

indexRouter.all('*', Middleware.checkUser);

indexRouter.get('/', (_req: Request, res: Response) => {
  res.send('Welcom to TimeTubeTracker');
});

export default indexRouter;
