import express, { Router, Request, Response } from 'express';

const indexRouter: Router = express.Router();

indexRouter.get('/', (_req: Request, res: Response) => {
  res.send('Welcom to TimeTubeTracker');
});

export default indexRouter;
