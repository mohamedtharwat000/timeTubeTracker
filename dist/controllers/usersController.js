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
/**
 * The User Controller for signup, login, etc...
 */
class UserController {
    /**
     * POST /api/signup
     * Sign up a new user
     *
     * @static
     * @async
     * @param {Request<{}, {}, {email: string, username: string, password: string}, {}>} req -  express Request
     * contains the mandatory fields: email, username, and password.
     * @param {Response} res -  express Response
     */
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
            try {
                yield user.save();
            }
            catch (err) {
                const error = err;
                const errorsToSend = { error: [] };
                if (error.code == 11000) {
                    const duplicateKeyField = Object.keys(error.keyPattern)[0];
                    return res.status(400).json({ error: `Duplication in ${duplicateKeyField}` });
                }
                if (error.errors.email) {
                    errorsToSend['error'].push({ email: error.errors.email.message });
                }
                if (error.errors.username) {
                    errorsToSend['error'].push({ username: error.errors.username.message });
                }
                // console.log(error.errors.username?.kind);
                // console.log(error.errors.email?.kind);
                // console.log(error.code);
                // console.log(error.keyPattern);
                // console.log(error.keyValue);
                return res.status(401).json(errorsToSend);
            }
            return res.status(200).json({ registerd: { email, username } });
        });
    }
    /**
     * POST /api/login
     * login a new user and add a JWT token as cookie session_id
     *
     * @static
     * @async
     * @param {Request<{}, {}, { email: loginField, username: loginField, password: string}, {}>} req - express Request
     * contains the mandatory: email || username, and password
     * @param {Response} res - express Response
     */
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