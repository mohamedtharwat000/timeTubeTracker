"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = __importDefault(require("../models/storage/mongodb"));
const redisdb_1 = __importDefault(require("../models/storage/redisdb"));
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
        const mongoState = mongodb_1.default.readyState;
        const redisState = redisdb_1.default.connected();
        if (mongoState === 1 && redisState) {
            return res.status(200).json({ status: 'api ready' });
        }
        return res.status(500).json({ error: 'api not ready' });
    }
}
exports.default = AppController;
