"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("../models/users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * The Middleware Controller, contains every Middleware used.
 */
class Middleware {
    /**
     * A Middleware to check if there is a logged in user in the session.
     * If there is a user, add his username to the res.locals object to use
     * within the view engine in the front end, ejs.
     *
     * @static
     * @async
     * @param {Request} req - express Request to get from it the session_id cookie
     * @param {Response<{}, {user: { username: string, email: string } | null}>} res - express Response will contains the user information if he is logged in
     * @param {NextFunction} next - the next function to be called.
     */
    static async checkUser(req, res, next) {
        const token = req.cookies.session_id;
        const secert_key = process.env.secretKey;
        if (!token) {
            res.locals.user = null;
            return next();
        }
        try {
            const payload = jsonwebtoken_1.default.verify(token, secert_key);
            const { email, username } = payload;
            const user = await users_1.default.findOne({ email: email, username: username }).exec();
            if (user) {
                const userToAdd = { username: user.username, email: user.email };
                res.locals.user = userToAdd;
            }
            else {
                res.locals.user = null;
                res.cookie('session_id', '', { maxAge: 1 });
            }
        }
        catch {
            res.locals.user = null;
            res.cookie('session_id', '', { maxAge: 1 });
        }
        return next();
    }
    /**
     * A Middleware to use on any protected route.
     *
     * @static
     * @async
     * @param {Request} req - express Request contains the session_id as a cookie
     * @param {Response} res - express Request
     * @param {NextFunction} next - the next function to be called
     */
    static async protectedRoute(req, res, next) {
        const token = req.cookies.session_id;
        const secert_key = process.env.secretKey;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const payload = jsonwebtoken_1.default.verify(token, secert_key);
            const { email, username } = payload;
            const user = await users_1.default.findOne({ email: email, username: username }).exec();
            if (!user) {
                res.cookie('session_id', '', { maxAge: 1 });
                return res.status(401).json({ error: 'Unauthorized' });
            }
        }
        catch {
            res.cookie('session_id', '', { maxAge: 1 });
            return res.status(401).json({ error: 'Unauthorized' });
        }
        return next();
    }
}
exports.default = Middleware;
