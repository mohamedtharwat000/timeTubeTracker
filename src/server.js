"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cookie_parser_1 = require("cookie-parser");
var app = (0, express_1.default)();
var port = process.env.port || 5000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.listen(port);
