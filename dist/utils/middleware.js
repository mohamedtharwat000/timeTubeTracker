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
    static checkUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.session_id;
            const secert_key = process.env.secretKey;
            if (!token) {
                res.locals.user = null;
                return next();
            }
            try {
                const payload = jsonwebtoken_1.default.verify(token, secert_key);
                const { email, username } = payload;
                const user = yield users_1.default.findOne({ email: email, username: username }).exec();
                if (user) {
                    const userToAdd = { username: user.username, email: user.email };
                    res.locals.user = userToAdd;
                }
                else {
                    res.locals.user = null;
                    res.cookie('session_id', '', { maxAge: 1 });
                }
            }
            catch (_a) {
                res.locals.user = null;
                res.cookie('session_id', '', { maxAge: 1 });
            }
            return next();
        });
    }
}
exports.default = Middleware;
