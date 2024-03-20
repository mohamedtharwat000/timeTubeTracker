"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const api_1 = __importDefault(require("./routes/api"));
const index_1 = __importDefault(require("./routes/index"));
const helmet_1 = __importDefault(require("helmet"));
const db_1 = __importDefault(require("./models/storage/db"));
const redis_1 = __importDefault(require("./models/storage/redis"));
const app = (0, express_1.default)();
const port = process.env.port || 3000;
(0, db_1.default)().then(() => console.log('Connected to DB'), () => console.log('Failed connecting to DB'));
redis_1.default.connect().then(() => console.log('Connected to Redis'), () => console.log('Failed connecting to Redis'));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.static('static'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/', index_1.default);
app.use('/api', api_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
