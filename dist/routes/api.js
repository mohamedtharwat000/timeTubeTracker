"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiController_1 = __importDefault(require("../controllers/apiController"));
const favoritesController_1 = __importDefault(require("../controllers/favoritesController"));
const playlistController_1 = __importDefault(require("../controllers/playlistController"));
const apiRouter = express_1.default.Router();
apiRouter.get('/status', apiController_1.default.status);
apiRouter.post('/playlist', playlistController_1.default.calculateMulitplePlaylists);
apiRouter.get('/favorite', favoritesController_1.default.getFavorites);
apiRouter.post('/favorite', favoritesController_1.default.addToFavorite);
apiRouter.delete('/favorite/:id', favoritesController_1.default.removeFromFavorite);
exports.default = apiRouter;
