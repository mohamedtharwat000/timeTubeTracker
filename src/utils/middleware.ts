import { Request, Response, NextFunction } from 'express';
import User from '../models/users';
import jwt from 'jsonwebtoken';

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
    static async checkUser(req: Request, res: Response<{}, { user: { username: string, email: string } | null }>, next: NextFunction) {
        const token = req.cookies.session_id as string;
        const secert_key: jwt.Secret = process.env.secretKey!;

        if (!token) {
            res.locals.user = null;
            return next();
        }

        try {
            const payload = jwt.verify(token, secert_key);
            const { email, username } = payload as { email: string, username: string };

            const user = await User.findOne({ email: email, username: username }).exec();

            if (user) {
                const userToAdd = { username: user.username, email: user.email };
                res.locals.user = userToAdd;
            } else {
                res.locals.user = null;
                res.cookie('session_id', '', { maxAge: 1 });
            }
        } catch {
            res.locals.user = null;
            res.cookie('session_id', '', { maxAge: 1 });
        }
        return next();
    }
}

export default Middleware;
