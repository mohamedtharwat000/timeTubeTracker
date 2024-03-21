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
  ): Promise<Response | void> {
    const token: string | undefined = req.cookies.sessionId;
    const { secretKey } = process.env;

    if (!token) {
      res.locals.user = null;
      return next();
    }

    if (!secretKey) {
      throw new Error('Secret key not found in environment variables.');
    }

    try {
      const payload = jwt.verify(token, secretKey);
      const { email, username } = payload as {
        email: string;
        username: string;
      };

      const user: UserInterface | null = await User.findOne({
        email,
        username,
      }).exec();

      if (!user) {
        res.cookie('sessionId', '', { maxAge: 1 });
        return res.status(401).json({ error: 'Unauthorized1' });
      }
      res.locals.user = user;
    } catch {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return next();
  }
}

export default Middleware;
