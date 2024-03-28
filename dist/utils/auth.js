"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ms_1 = __importDefault(require("ms"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generates a JWT token based on the provided user information.
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @param {boolean} rememberMe - Indicates if the user wants to be remembered.
 * @returns {string} The generated JWT token.
 * @throws {Error} If the secret key is not provided.
 */
function generateToken(username, email, rememberMe) {
    const { secretKey } = process.env;
    const payload = { username, email, rememberMe };
    const tokenMaxAge = rememberMe ? { expiresIn: '30d' } : {};
    return jsonwebtoken_1.default.sign(payload, secretKey, tokenMaxAge);
}
/**
 * Sets the session cookie with the provided JWT token.
 * @param {Response} res - The response object to set the cookie on.
 * @param {string} token - The JWT token to set in the cookie.
 * @param {boolean} rememberMe - Indicates if the user wants to be remembered.
 */
function setSessionCookie(res, token, rememberMe) {
    const cookieMaxAge = rememberMe ? { maxAge: (0, ms_1.default)('30d') } : {};
    res.cookie('sessionId', token, {
        httpOnly: true,
        secure: true,
        ...cookieMaxAge,
    });
}
exports.default = { generateToken, setSessionCookie };
