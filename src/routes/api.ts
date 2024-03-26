import express, { Router } from 'express';
import ApiController from '../controllers/apiController';
import FavoritesController from '../controllers/favoritesController';
import PlaylistController from '../controllers/playlistController';

const apiRouter: Router = express.Router();

apiRouter.get('/status', ApiController.status);

apiRouter.post('/playlist', PlaylistController.calculateMulitplePlaylists);

apiRouter.get('/favorite', FavoritesController.getFavorites);
apiRouter.post('/favorite', FavoritesController.addToFavorite);
apiRouter.delete('/favorite/:id', FavoritesController.removeFromFavorite);

export default apiRouter;
