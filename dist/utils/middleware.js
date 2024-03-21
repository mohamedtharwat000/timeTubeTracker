"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/users/user"));
dotenv_1.default.config();
/**
 * Middleware class containing methods for user authentication and authorization.
 */
class Middleware {
    /**
     * Middleware to check if a user is logged in.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next function.
     * @returns Promise<void>
     */
    static async checkUser(req, res, next) {
        const token = req.cookies.sessionId;
        const { secretKey } = process.env;
        if (!token) {
            res.locals.user = null;
            return next();
        }
        if (!secretKey) {
            throw new Error('Secret key not found in environment variables.');
        }
        const payload = jsonwebtoken_1.default.verify(token, secretKey);
        const { email, username } = payload;
        const user = await user_1.default.findOne({
            email,
            username,
        }).exec();
        if (user) {
            res.locals.user = { username, email };
        }
        else {
            res.locals.user = null;
            res.cookie('sessionId', '', { maxAge: 1 });
        }
        return next();
    }
    /**
     * Middleware to protect routes requiring authentication.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next function.
     * @returns Promise<void>
     */
    static async protectedRoute(req, res, next) {
        const token = req.cookies.sessionId;
        const { secretKey } = process.env;
        if (!token || !secretKey) {
            res.status(401).json({ error: 'Unauthorized' });
        }
        const payload = jsonwebtoken_1.default.verify(token, secretKey);
        const { email, username } = payload;
        const user = await user_1.default.findOne({
            email,
            username,
        }).exec();
        if (!user) {
            res.cookie('sessionId', '', { maxAge: 1 });
            res.status(401).json({ error: 'Unauthorized' });
        }
        res.locals.user = user;
        return next();
    }
}
exports.default = Middleware;
