/* eslint-disable @typescript-eslint/unbound-method */
import express, { Router } from 'express';
import UserController from '../controllers/usersController';
import AppController from '../controllers/AppController';
import Middleware from '../utils/middleware';

const router: Router = express.Router();

router.get('/status', AppController.status);

router.post('/signup', UserController.singUpPost);
router.post('/login', UserController.loginPost);
router.delete('/logout', UserController.logout);

router.get('/favorite', Middleware.protectedRoute, UserController.getFavorites);
router.post('/favorite', Middleware.protectedRoute, UserController.addToFavorite);
router.delete('/favorite', Middleware.protectedRoute, UserController.removeFromFavorite);

export default router;

