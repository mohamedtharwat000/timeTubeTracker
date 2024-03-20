"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const hlputils_1 = require("hlputils");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_1 = __importDefault(require("./routes/index"));
const api_1 = __importDefault(require("./routes/api"));
const app = (0, express_1.default)();
const port = process.env.port || '3000';
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use('/', index_1.default);
app.use('/api', api_1.default);
app.listen(port, () => {
    (0, hlputils_1.log)(`Server is running on port ${port}.`);
});
