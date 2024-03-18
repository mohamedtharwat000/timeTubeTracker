"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/unbound-method */
const express_1 = __importDefault(require("express"));
const usersController_1 = __importDefault(require("../controllers/usersController"));
const AppController_1 = __importDefault(require("../controllers/AppController"));
const router = express_1.default.Router();
router.post('/signup', usersController_1.default.singUpPost);
router.post('/login', usersController_1.default.loginPost);
router.get('/status', AppController_1.default.status);
exports.default = router;
