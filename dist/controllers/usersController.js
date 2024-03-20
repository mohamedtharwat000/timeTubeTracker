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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const ms_1 = __importDefault(require("ms"));
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
                return res.status(400).send({ error: 'Email is required' });
            if (!username)
                return res.status(400).send({ error: 'Username is required' });
            if (!password)
                return res.status(400).send({ error: 'Password is required' });
            const hashedPassowrd = yield bcrypt_1.default.hash(password, yield bcrypt_1.default.genSalt());
            const user = new users_1.default({
                email, username, password: hashedPassowrd
            });
            try {
                yield user.save();
            }
            catch (err) {
                const error = err;
                const errorsToSend = { errors: [] };
                if (error.code == 11000) {
                    const duplicateKeyField = Object.keys(error.keyPattern)[0];
                    return res.status(400).json({ error: `${duplicateKeyField} already exists.` });
                }
                if (error.errors.email)
                    errorsToSend.errors.push({ email: error.errors.email.message });
                if (error.errors.username)
                    errorsToSend.errors.push({ username: error.errors.username.message });
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
     * @param {Request<{}, {}, { email: LoginField, username: LoginField, password: string}, {}>} req - express Request
     * contains the mandatory: email || username, and password
     * @param {Response} res - express Response
     */
    static loginPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, username, password } = req.body;
            if (!email && !username)
                return res.status(400).send({ error: 'Email or Username are required' });
            if (!password)
                return res.status(400).send({ error: 'Pssword is required' });
            const dataToLogInWith = email ? { email: email } : { username: username };
            const user = yield users_1.default.findOne(dataToLogInWith).exec();
            if (!user) {
                return res.status(404).send({ error: 'User was not found' });
            }
            const isValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const rememberMe = req.body.remember_me || false;
            const secerKkey = process.env.secretKey;
            const payload = { username: user.username, email: user.email };
            const cookieMaxAge = rememberMe ? { maxAge: (0, ms_1.default)('60s') } : {};
            const token = jsonwebtoken_1.default.sign(payload, secerKkey, rememberMe ? undefined : { expiresIn: '3d' });
            res.cookie('session_id', token, Object.assign({ httpOnly: true, secure: true }, cookieMaxAge));
            return res.status(200).json({ token: token });
        });
    }
    /**
     * DELETE /api/logout
     * Logout a user from the session
     *
     * @static
     * @param {Request} req - express Request contains the session_id cookie
     * @param {Response} res - express Response
     */
    static logout(req, res) {
        const token = req.cookies.session_id;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        res.cookie('session_id', '', { maxAge: 1 });
        return res.status(200).json({ success: "logged out" });
    }
    /**
     * POST /api/addlist
     * Add a new playlist link to a user's favorite list
     *
     * @static
     * @async
     * @param {Request<{}, {}, { playlistURL: string }, {}>} req - express Request contains the playlist url
     * @param {Response<{}, { user: IUser }>} res - express Response contains the local object variable `user`
     */
    static addToFavorite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.user;
            const { playlistURL } = req.body;
            if (!user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const userId = user._id;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            if (!user.favorites.includes(playlistURL)) {
                yield users_1.default.findOneAndUpdate(userId, {
                    $push: {
                        favorites: playlistURL
                    }
                });
                return res.status(200).json({
                    success: {
                        message: "Playlist was added successfully",
                        playlist: playlistURL,
                        userId: userId
                    }
                });
            }
            else {
                return res.status(406).json({ error: "Playlist already exists in your favorite list" });
            }
        });
    }
    /**
     * DELETE /api/removelist
     * Remove a playlist url from a user's favorite list
     *
     * @static
     * @async
     * @param {Request<{}, {}, { playlistURL: string }, {}>} req - express Request contains the playlist url
     * @param {Response<{}, { user: IUser }>} res - express Response contains the local object variable `user`
     */
    static removeFromFavorite(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = res.locals.user;
            const { playlistURL } = req.body;
            if (!user) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const userId = user._id;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            if (user.favorites.includes(playlistURL)) {
                yield users_1.default.findOneAndUpdate(userId, {
                    $pull: {
                        favorites: playlistURL
                    }
                });
                return res.status(200).json({
                    success: {
                        message: "Playlist deleted successfully",
                        playlist: playlistURL,
                        userId: userId
                    }
                });
            }
            else {
                return res.status(406).json({ error: "Playlist does not exists in your favorite list" });
            }
        });
    }
    /**
     * GET /api/getlist
     * Retrieve user's favorite list
     *
     * @static
     * @param {Request} _req - express Request
     * @param {Response<{}, { user: IUser }>} res - express Response contains the local object variable `user`
     */
    static getFavorites(_req, res) {
        const user = res.locals.user;
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const favorites = user.favorites;
        return res.status(200).json(favorites);
    }
}
exports.default = UserController;
