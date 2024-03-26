import express, { Router, Request, Response } from 'express';
import UserController from '../controllers/usersController';

const indexRouter: Router = express.Router();

indexRouter.get('/', (_req: Request, res: Response) => {
  res.render('home', { title: 'Home' });
});

indexRouter.post('/signup', UserController.signUp);
indexRouter.post('/login', UserController.login);
indexRouter.get('/logout', UserController.logout);

export default indexRouter;
