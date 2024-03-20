import express, { Router } from 'express';
import AppController from '../controllers/AppController';
import UserController from '../controllers/usersController';
// import Middleware from '../utils/middleware';

// const authMiddleware = Middleware.protectedRoute;
const apiRouter: Router = express.Router();

apiRouter.get('/status', AppController.status);

apiRouter.post('/signup', UserController.signUp);
apiRouter.post('/login', UserController.login);
// apiRouter.delete('/logout', UserController.logout);

// apiRouter.get('/getlist', authMiddleware, UserController.getFavorites);
// apiRouter.post('/addlist', authMiddleware, UserController.addToFavorite);
// apiRouter.delete('/rmlist', authMiddleware, UserController.removeFromFavorite);

export default apiRouter;
