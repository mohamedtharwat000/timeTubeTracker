import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User, { UserInterface } from '../models/user';

dotenv.config();

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
  static async auth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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
      const payload = jwt.verify(sessionId || authorization, secretKey);
      const { email, username } = payload as {
        email: string;
        username: string;
      };

      const user: UserInterface = await User.findOne({
        $or: [{ email }, { username }],
      }).exec();

      if (!user) {
        res.clearCookie('sessionId');
        res.locals.user = null;
      }

      res.locals.user = user;
    } catch (error) {
      res.clearCookie('sessionId');
      res.locals.user = null;
    }

    return next();
  }
}

export default Middleware;
