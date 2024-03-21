"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const indexRouter = express_1.default.Router();
indexRouter.get('*', middleware_1.default.auth);
indexRouter.get('/', (_req, res) => {
    res.render('home', { title: 'Home' });
});
exports.default = indexRouter;
