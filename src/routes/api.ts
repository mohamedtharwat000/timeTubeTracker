import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import ms from 'ms';
import AppController from '../controllers/appController';
import UserController from '../controllers/usersController';
import FavoritesController from '../controllers/favoritesController';
import PlaylistController from '../controllers/playlistController';

const apiRouter: Router = express.Router();

apiRouter.use(
  rateLimit({
    windowMs: ms('1m'),
    limit: 20,
    message: { error: 'Too many requests. Please try again after 1 minute' },
  }),
);

apiRouter.get('/status', AppController.status);

apiRouter.post('/signup', UserController.signUp);
apiRouter.post('/login', UserController.login);
apiRouter.delete('/logout', UserController.logout);

apiRouter.get('/favorite', FavoritesController.getFavorites);
apiRouter.post('/favorite', FavoritesController.addToFavorite);
apiRouter.delete('/favorite', FavoritesController.removeFromFavorite);

apiRouter.post('/playlist', PlaylistController.calculateMulitplePlaylists);

export default apiRouter;
