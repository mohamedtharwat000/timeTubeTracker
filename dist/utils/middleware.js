"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Middleware {
    static checkUser(req, res, next) {
        const token = req.cookies.session_id;
        if (!token) {
            res.locals.user = null;
            return next();
        }
        res.locals.user = "TODO";
        return next();
    }
}
exports.default = Middleware;
