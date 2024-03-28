"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const hlputils_1 = require("hlputils");
const redisClient = (0, redis_1.createClient)();
redisClient
    .on('connect', () => (0, hlputils_1.log)('Connected to Redis.'))
    .on('error', (err) => (0, hlputils_1.log)(`Redis Client Error: ${err}`))
    .connect();
exports.default = redisClient;
