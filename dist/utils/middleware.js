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
 * Middleware class containing methods for user authentication and protected routes.
 */
class Middleware {
    /**
     * Middleware function to ensuring user authentication.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next function.
     */
    static async auth(req, res, next) {
        const token = req.cookies.sessionId;
        const { secretKey } = process.env;
        if (!token) {
            res.locals.user = null;
            return next();
        }
        if (!secretKey) {
            throw new Error('Secret key not found in environment variables.');
        }
        try {
            const payload = jsonwebtoken_1.default.verify(token, secretKey);
            const { email, username } = payload;
            const user = await user_1.default.findOne({
                email,
                username,
            }).exec();
            if (!user) {
                res.cookie('sessionId', '', { maxAge: 1 });
                res.status(401).json({ error: 'Unauthorized1' });
            }
            res.locals.user = user;
        }
        catch {
            res.status(401).json({ error: 'Unauthorized' });
        }
        return next();
    }
}
exports.default = Middleware;
