import { Request, Response } from 'express';
import { dbConnection as dbStatus } from '../models/storage/db';
import redisClient from '../models/storage/redis';

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
        const dbConnection: number = dbStatus.readyState;

        if (dbConnection !== 1) {
            return res.status(500).json({ error: "connection to db has failed" });
        }
        if (!redisClient.isAlive()) {
            return res.status(500).json({ error: "connection to redis has failed" });
        }
        return res.status(200).json({ db: !!dbConnection, redis: redisClient.isAlive()});
    }
}

export default AppController;
