"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ms_1 = __importDefault(require("ms"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const hlputils_1 = require("hlputils");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const api_1 = __importDefault(require("./routes/api"));
const index_1 = __importDefault(require("./routes/index"));
const middleware_1 = __importDefault(require("./utils/middleware"));
dotenv_1.default.config();
const { port } = process.env;
const authMiddleware = middleware_1.default.auth;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(authMiddleware);
app.use((0, express_rate_limit_1.default)({
    windowMs: (0, ms_1.default)('1m'),
    limit: 100,
    message: { error: 'Too many requests. Please try again later' },
}));
app.use('/static', express_1.default.static(path_1.default.join(__dirname, '/static')));
app.use('/static/node_modules', express_1.default.static(path_1.default.join(__dirname, '../node_modules/')));
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.use('/', index_1.default);
app.use('/api', api_1.default);
app.listen(port, () => {
    (0, hlputils_1.log)(`Server is running on port ${port}.`);
});
