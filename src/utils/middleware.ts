import { Request, Response, NextFunction } from 'express';


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
     * @param {Request} req - express Request to get from it the session_id cookie
     * @param {Response} res - express Response
     * @param {NextFunction} next - the next function to be called.
     */
    static checkUser(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies.session_id as string;

        if (!token) {
            res.locals.user = null;
            return next();
        }

        res.locals.user = "TODO";
        return next();
    }
}

export default Middleware;
