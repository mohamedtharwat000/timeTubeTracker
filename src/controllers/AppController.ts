import { Request, Response } from 'express';
import mongodb from '../models/storage/mongodb';

/**
 * App Controller handles some routes
 */
class AppController {
  /**
   * GET /api/status
   * checks the status of the database and redis
   *
   * @static
   * @param {Request} _req - express Request
   * @param {Response} res - express  Response
   */
  static status(_req: Request, res: Response) {
    const dbStat: number = mongodb.readyState;

    if (dbStat === 1) {
      return res.status(200).json({ status: 'connected' });
    }

    return res.status(500).json({ error: 'no connection to database' });
  }
}

export default AppController;
