import express, { Router } from 'express';
import AppController from '../controllers/AppController';
import UserController from '../controllers/usersController';
import FavoritesController from '../controllers/favoritesController';
import Middleware from '../utils/middleware';

const authMiddleware = Middleware.protectedRoute;
const apiRouter: Router = express.Router();

apiRouter.get('/status', AppController.status);

apiRouter.post('/signup', UserController.signUp);
apiRouter.post('/login', UserController.login);
apiRouter.delete('/logout', UserController.logout);

apiRouter.get('/favorite', authMiddleware, FavoritesController.getFavorites);
apiRouter.post('/favorite', authMiddleware, FavoritesController.addToFavorite);
apiRouter.delete(
  '/favorite',
  authMiddleware,
  FavoritesController.removeFromFavorite,
);

export default apiRouter;
