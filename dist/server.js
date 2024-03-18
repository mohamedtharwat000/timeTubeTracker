"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const api_1 = __importDefault(require("./routes/api"));
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
const port = process.env.port || 3001;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/', index_1.default);
app.use('/api', api_1.default);
app.use(express_1.default.static('static'));
app.use(express_1.default.urlencoded({ extended: true }));
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
