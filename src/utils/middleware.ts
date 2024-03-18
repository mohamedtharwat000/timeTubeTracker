import { Request, Response, NextFunction } from 'express';


class Middleware {
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
