"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = __importDefault(require("../controllers/usersController"));
const indexRouter = express_1.default.Router();
indexRouter.get('/', (_req, res) => {
    res.render('home', { user: res.locals.user });
});
indexRouter.post('/signup', usersController_1.default.signUp);
indexRouter.post('/login', usersController_1.default.login);
indexRouter.get('/logout', usersController_1.default.logout);
exports.default = indexRouter;
