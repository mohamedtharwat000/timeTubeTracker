"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const setSessionCookie_1 = __importDefault(require("../utils/setSessionCookie"));
const user_1 = __importDefault(require("../models/user"));
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
            return res.status(400).send({
                error: {
                    username: !username ? 'Username is required.' : null,
                    email: !email ? 'Email is required.' : null,
                    password: !password ? 'Password is required.' : null,
                },
            });
        }
        const ifValidEmail = validator_1.default.isEmail(email);
        const ifValidUsername = validator_1.default.isAlphanumeric(username);
        const ifValidPassword = validator_1.default.isStrongPassword(password, {
            minLength: 5,
            minNumbers: 1,
            minUppercase: 0,
            minSymbols: 0,
        });
        if (!ifValidEmail) {
            return res.status(400).json({ error: { email: 'Invalid Email' } });
        }
        if (!ifValidUsername) {
            return res.status(400).json({
                error: { username: 'Invalid Username! Only Alphanumeric words' },
            });
        }
        if (!ifValidPassword) {
            return res
                .status(400)
                .json({ error: { password: 'Please enter a stronger Password' } });
        }
        return bcrypt_1.default
            .hash(password, await bcrypt_1.default.genSalt())
            .catch((err) => res.status(401).json({ err }))
            .then((hash) => {
            const user = new user_1.default({
                email,
                username,
                password: hash,
                favorites: [],
            });
            return user.save();
        })
            .then(() => res.status(200).json({ registered: { email, username } }))
            .catch((err) => {
            if (err.code === 11000) {
                const duplicateKeyField = Object.keys(err.keyValue)[0];
                return res.status(400).json({
                    error: {
                        [duplicateKeyField]: `${duplicateKeyField} already exists.`,
                    },
                });
            }
            return res.status(400).json({
                error: err.message,
            });
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
            return res.status(400).send({
                error: {
                    usernameOrEmail: !email || !username ? 'Email or Username are required.' : null,
                    password: !password ? 'Password is required.' : null,
                },
            });
        }
        const user = await user_1.default.findOne({
            $or: [{ email }, { username }],
        }).exec();
        if (!user) {
            return res
                .status(404)
                .send({ error: { usernameOrEmail: 'Email/Username was not found' } });
        }
        const isValidPassword = await bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res
                .status(404)
                .json({ error: { password: 'Incorrect password' } });
        }
        const token = (0, generateToken_1.default)(user.username, user.email, !!req.body.rememberMe);
        (0, setSessionCookie_1.default)(res, token, !!req.body.rememberMe);
        return res.status(200).json({ token });
    }
    /**
     * GET /api/logout
     * Logout a user from the session
     * And save the token to the blacklist cache list
     *
     * @static
     * @param {Request} req - express Request contains the session_id cookie
     * @param {Response} res - express Response
     */
    static logout(req, res) {
        res.clearCookie('sessionId');
        return res.redirect('/');
    }
}
exports.default = UserController;
