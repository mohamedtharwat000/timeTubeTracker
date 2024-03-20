"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbHost = process.env.host || 'localhost';
const dbPort = process.env.dbPort || '27017';
const dbName = process.env.dbName || 'timetubetracker';
const dbURI = `mongodb://${dbHost}:${dbPort}/${dbName}`;
mongoose_1.default
    .connect(dbURI)
    .then(() => {
    console.log('Connected To database.');
})
    .catch((err) => console.log('error', err));
exports.default = mongoose_1.default.connection;
