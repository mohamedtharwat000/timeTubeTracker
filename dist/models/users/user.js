"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = require("validator");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [4, 'Username must be at least 4 characters long'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator_1.isEmail, 'Email address must be a valid email address'],
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    favorites: {
        type: [String],
        default: [],
    },
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
