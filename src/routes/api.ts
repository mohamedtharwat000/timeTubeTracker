import express, { Router } from 'express';
import AppController from '../controllers/appController';
import UserController from '../controllers/usersController';
import FavoritesController from '../controllers/favoritesController';
import PlaylistController from '../controllers/playlistController';

const apiRouter: Router = express.Router();

apiRouter.get('/status', AppController.status);

apiRouter.post('/signup', UserController.signUp);
apiRouter.post('/login', UserController.login);
apiRouter.delete('/logout', UserController.logout);

apiRouter.get('/favorite', FavoritesController.getFavorites);
apiRouter.post('/favorite', FavoritesController.addToFavorite);
apiRouter.delete('/favorite:id', FavoritesController.removeFromFavorite);

apiRouter.post('/playlist', PlaylistController.calculateMulitplePlaylists);

export default apiRouter;
