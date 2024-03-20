"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/unbound-method */
const express_1 = __importDefault(require("express"));
const usersController_1 = __importDefault(require("../controllers/usersController"));
const AppController_1 = __importDefault(require("../controllers/AppController"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const router = express_1.default.Router();
router.get('/status', AppController_1.default.status);
router.post('/signup', usersController_1.default.singUpPost);
router.post('/login', usersController_1.default.loginPost);
router.delete('/logout', usersController_1.default.logout);
router.get('/getlist', middleware_1.default.protectedRoute, usersController_1.default.getFavorites);
router.post('/addlist', middleware_1.default.protectedRoute, usersController_1.default.addToFavorite);
router.delete('/removelist', middleware_1.default.protectedRoute, usersController_1.default.removeFromFavorite);
exports.default = router;
