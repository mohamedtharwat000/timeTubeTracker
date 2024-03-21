import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/users/user';
import UserInterface from '../models/users/userInterface';

dotenv.config();

/**
 * Middleware class containing methods for user authentication and authorization.
 */
class Middleware {
  /**
   * Middleware to check if a user is logged in.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns Promise<void>
   */
  static async checkUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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

      if (user) {
        res.locals.user = { username, email };
      } else {
        res.locals.user = null;
        res.cookie('sessionId', '', { maxAge: 1 });
      }
      return next();
    } catch {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }

  /**
   * Middleware to protect routes requiring authentication.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next function.
   * @returns Promise<void>
   */
  static async protectedRoute(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const token: string | undefined = req.cookies.sessionId;
    const { secretKey } = process.env;

    if (!token || !secretKey) {
      res.status(401).json({ error: 'Unauthorized' });
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
        res.status(401).json({ error: 'Unauthorized' });
      }

      res.locals.user = user;
      return next();
    } catch {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
}

export default Middleware;
