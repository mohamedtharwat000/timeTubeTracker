import { Request, Response } from 'express';
import db from '../models/storage/db';

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
        const dbConnection: number = db.readyState;

        if (dbConnection !== 1) {
            return res
                .status(500)
                .json({ error: 'connection to db has failed' });
        }
        return res.status(200).json({ dbConnection });
    }
}

export default AppController;
