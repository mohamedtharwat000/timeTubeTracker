import express, { Router } from 'express';
import Middleware from '../utils/middleware';
import AppController from '../controllers/appController';
import UserController from '../controllers/usersController';
import FavoritesController from '../controllers/favoritesController';
import PlaylistController from '../controllers/playlistController';

const authMiddleware = Middleware.auth;
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

apiRouter.post('/playlist', PlaylistController.calculatePlaylist);

export default apiRouter;
