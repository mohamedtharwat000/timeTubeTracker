"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import Middleware from '../utils/middleware';
const indexRouter = express_1.default.Router();
// indexRouter.all('*', Middleware.checkUser);
indexRouter.get('/', (_req, res) => {
    res.send('Welcom to TimeTubeTracker');
});
exports.default = indexRouter;
