"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const ms_1 = __importDefault(require("ms"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/users/user"));
/**
 * Class representing user controller methods.
 */
class UserController {
    /**
     * Handle user sign up.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @returns {Promise<Response>} A promise containing the response.
     */
    static async signUp(req, res) {
        const { username, email, password } = req.body;
        if (!email || !username || !password) {
            return res
                .status(400)
                .send({ error: 'Email, username and password are required' });
        }
        return bcrypt_1.default
            .hash(password, await bcrypt_1.default.genSalt())
            .catch((err) => res.status(401).json({ err }))
            .then((hash) => {
            const user = new user_1.default({
                email,
                username,
                password: hash,
            });
            return user.save();
        })
            .then(() => res.status(200).json({ registered: { email, username } }))
            .catch((err) => {
            res.status(401).json({ error: err.message.split(':')[0] });
        })
            .then(() => res);
    }
    /**
     * Handle user login.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @returns {Promise<Response>} A promise containing the response.
     */
    static async login(req, res) {
        const { username, email, password } = req.body;
        if ((!email && !username) || !password) {
            return res
                .status(400)
                .send({ error: 'Email or username and password are required' });
        }
        const user = await user_1.default.findOne({
            $or: [{ email }, { username }],
        }).exec();
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const secretKey = process.env.secretKey;
        const rememberMe = !!req.body.rememberMe;
        const payload = {
            username,
            email,
            rememberMe,
        };
        const tokenMaxAge = rememberMe ? { expiresIn: '3s' } : {};
        const cookieMaxAge = rememberMe ? { maxAge: (0, ms_1.default)('60s') } : {};
        const token = jsonwebtoken_1.default.sign(payload, secretKey, tokenMaxAge);
        res.cookie('sessionId', token, {
            httpOnly: true,
            secure: true,
            ...cookieMaxAge,
        });
        return res.status(200).json({ token });
    }
}
exports.default = UserController;
