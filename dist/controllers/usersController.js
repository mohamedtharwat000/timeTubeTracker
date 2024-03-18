"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_1 = __importDefault(require("../models/users"));
class UserController {
    static singUpPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, username, password } = req.body;
            if (!email)
                return res.status(400).send({ error: 'Missing email' });
            if (!username)
                return res.status(400).send({ error: 'Missing username' });
            if (!password)
                return res.status(400).send({ error: 'Missing password' });
            const hashedPassowrd = yield bcrypt_1.default.hash(password, yield bcrypt_1.default.genSalt());
            const user = new users_1.default({
                email, username, password: hashedPassowrd
            });
            yield user.save();
            return res.status(200).json({ email, username });
        });
    }
    static loginPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, username, password } = req.body;
            if (!email && !username)
                return res.status(400).send({ error: 'Missing email and username' });
            if (!password)
                return res.status(400).send({ error: 'Missing password' });
            const dataToLogInWith = email ? { email: email } : { username: username };
            const user = yield users_1.default.findOne(dataToLogInWith).exec();
            if (!user) {
                return res.status(404).send({ error: 'User was not found' });
            }
            const isValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            return res.status(200).json({ token: "token111" });
        });
    }
}
exports.default = UserController;
