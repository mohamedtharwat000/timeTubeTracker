import { Request, Response } from 'express';
import mongodb from '../models/storage/mongodb';
import redisClient from '../models/storage/redisdb';

/**
 * App Controller handles some routes
 */
class ApiController {
  /**
   * GET /api/status
   * checks the status of the database and redis
   *
   * @static
   * @param {Request} _req - express Request
   * @param {Response} res - express  Response
   */
  static status(_req: Request, res: Response) {
    const mongoState: number = mongodb.readyState;
    const redisState: boolean = redisClient.isOpen;

    if (mongoState === 1 && redisState) {
      return res.status(200).json({ status: 'ready' });
    }
    return res.status(500).json({ error: 'not ready' });
  }
}

export default ApiController;
