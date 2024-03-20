"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/unbound-method */
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const router = express_1.default.Router();
router.get('*', middleware_1.default.checkUser);
router.get('/', (_req, res) => {
    res.send('Main route');
});
exports.default = router;
