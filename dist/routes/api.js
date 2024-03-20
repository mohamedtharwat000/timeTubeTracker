"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AppController_1 = __importDefault(require("../controllers/AppController"));
const usersController_1 = __importDefault(require("../controllers/usersController"));
// import Middleware from '../utils/middleware';
// const authMiddleware = Middleware.protectedRoute;
const apiRouter = express_1.default.Router();
apiRouter.get('/status', AppController_1.default.status);
apiRouter.post('/signup', usersController_1.default.signUp);
apiRouter.post('/login', usersController_1.default.login);
// apiRouter.delete('/logout', UserController.logout);
// apiRouter.get('/getlist', authMiddleware, UserController.getFavorites);
// apiRouter.post('/addlist', authMiddleware, UserController.addToFavorite);
// apiRouter.delete('/rmlist', authMiddleware, UserController.removeFromFavorite);
exports.default = apiRouter;
