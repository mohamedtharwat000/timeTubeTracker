"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../models/storage/db");
const redis_1 = __importDefault(require("../models/storage/redis"));
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
    static status(_req, res) {
        const dbConnection = db_1.dbConnection.readyState;
        if (dbConnection !== 1) {
            return res.status(500).json({ error: "connection to db has failed" });
        }
        console.log(redis_1.default.isAlive());
        if (!redis_1.default.isAlive()) {
            return res.status(500).json({ error: "connection to redis has failed" });
        }
        return res.status(200).json({ db: !!dbConnection, redis: redis_1.default.isAlive() });
    }
}
exports.default = AppController;
