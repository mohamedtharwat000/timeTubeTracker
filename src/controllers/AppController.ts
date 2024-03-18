import db from '../models/storage/db';
import { Request, Response } from 'express';


class AppController {
    static status(_req: Request, res: Response) {
        const dbConnection: number = db.readyState;

        if (dbConnection !== 1) {
            return res.status(500).json({ error: "connection to db has failed" });
        }
        return res.status(200).json({ dbConnection: dbConnection });
    }
}

export default AppController;
