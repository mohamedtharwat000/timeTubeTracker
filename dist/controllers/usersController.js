"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_1 = __importDefault(require("../models/users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ms_1 = __importDefault(require("ms"));
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
    static async singUpPost(req, res) {
        const { email, username, password } = req.body;
        if (!email)
            return res.status(400).send({ error: 'Email is required' });
        if (!username)
            return res.status(400).send({ error: 'Username is required' });
        if (!password)
            return res.status(400).send({ error: 'Password is required' });
        const hashedPassowrd = await bcrypt_1.default.hash(password, await bcrypt_1.default.genSalt());
        const user = new users_1.default({
            email, username, password: hashedPassowrd
        });
        try {
            await user.save();
        }
        catch (err) {
            const error = err;
            const errorsToSend = { errors: [] };
            if (error.code == 11000) {
                const duplicateKeyField = Object.keys(error.keyPattern)[0];
                return res.status(400).json({ error: `${duplicateKeyField}  already exists.` });
            }
            if (error.errors.email)
                errorsToSend.errors.push({ email: error.errors.email.message });
            if (error.errors.username)
                errorsToSend.errors.push({ username: error.errors.username.message });
            return res.status(401).json(errorsToSend);
        }
        return res.status(200).json({ registerd: { email, username } });
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
    static async loginPost(req, res) {
        const { email, username, password } = req.body;
        if (!email && !username)
            return res.status(400).send({ error: 'Email or Username are required' });
        if (!password)
            return res.status(400).send({ error: 'Pssword is required' });
        const dataToLogInWith = email ? { email: email } : { username: username };
        const user = await users_1.default.findOne(dataToLogInWith).exec();
        if (!user) {
            return res.status(404).send({ error: 'User was not found' });
        }
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const remember_me = req.body.remember_me || false;
        const secert_key = process.env.secretKey;
        const payload = { username: user.username, email: user.email };
        const cookieMaxAge = remember_me ? { maxAge: (0, ms_1.default)('60s') } : {};
        const token = jsonwebtoken_1.default.sign(payload, secert_key, remember_me ? undefined : { expiresIn: '3d' });
        res.cookie('session_id', token, { httpOnly: true, secure: true, ...cookieMaxAge });
        return res.status(200).json({ token: token });
    }
}
exports.default = UserController;
