"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
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
        const { sessionId } = req.cookies;
        const { authorization } = req.headers;
        const { secretKey } = process.env;
        if ((!sessionId && !authorization) || !secretKey) {
            res.locals.user = null;
            return next();
        }
        if (res.locals.user) {
            next();
        }
        try {
            const payload = jsonwebtoken_1.default.verify(sessionId || authorization, secretKey);
            const { email, username } = payload;
            const user = await user_1.default.findOne({
                $or: [{ email }, { username }],
            }).exec();
            if (!user) {
                res.clearCookie('sessionId');
                res.locals.user = null;
            }
            res.locals.user = user;
        }
        catch (error) {
            res.clearCookie('sessionId');
            res.locals.user = null;
        }
        return next();
    }
}
exports.default = Middleware;
