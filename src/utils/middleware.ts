import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/users/user';
import UserInterface from '../models/users/userInterface';

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
    const sessionIdToken: string | undefined = req.cookies.sessionId;
    const jwtToken: string | undefined = req.headers.authorization;
    const { secretKey } = process.env;

    if ((!sessionIdToken && !jwtToken) || !secretKey) {
      res.locals.user = null;
      return next();
    }

    const payload = jwt.verify(sessionIdToken || jwtToken, secretKey);
    const { email, username } = payload as {
      email: string;
      username: string;
    };

    const user: UserInterface = await User.findOne({
      email,
      username,
    }).exec();

    if (!user) {
      res.cookie('sessionId', '', { maxAge: 1 });
      res.locals.user = null;
    }

    res.locals.user = user;

    return next();
  }
}

export default Middleware;
