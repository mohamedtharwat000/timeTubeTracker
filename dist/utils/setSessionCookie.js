"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ms_1 = __importDefault(require("ms"));
/**
 * Sets the session cookie with the provided JWT token.
 * @param {Response} res - The response object to set the cookie on.
 * @param {string} token - The JWT token to set in the cookie.
 * @param {boolean} rememberMe - Indicates if the user wants to be remembered.
 */
function setSessionCookie(res, token, rememberMe) {
    const maxAge = { maxAge: rememberMe ? (0, ms_1.default)('30d') : null };
    res.cookie('sessionId', token, {
        httpOnly: true,
        secure: true,
        ...maxAge,
    });
}
exports.default = setSessionCookie;
