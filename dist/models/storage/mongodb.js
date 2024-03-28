"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const hlputils_1 = require("hlputils");
dotenv_1.default.config();
const { dbHost } = process.env;
const { dbPort } = process.env;
const { dbName } = process.env;
const dbURI = `mongodb://${dbHost}:${dbPort}/${dbName}`;
mongoose_1.default
    .connect(dbURI)
    .then(() => {
    (0, hlputils_1.log)('Connected To database.');
})
    .catch((err) => (0, hlputils_1.log)(err));
exports.default = mongoose_1.default.connection;
