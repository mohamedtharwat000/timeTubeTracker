/* eslint-disable @typescript-eslint/unbound-method */
import express, { Router } from 'express';
import { Request, Response } from 'express';
import UserController from '../controllers/usersController';
import AppController from '../controllers/AppController';
import Middleware from '../utils/middleware';

const router: Router = express.Router();


router.post('/signup', UserController.singUpPost);
router.post('/login', UserController.loginPost);

router.get('/status', AppController.status);

router.post('/addlist', Middleware.protectedRoute, (_req: Request, res: Response) => {
    res.status(200).send("TODO!");
});

export default router;

