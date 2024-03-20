import ms from 'ms';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

/**
 * Represents the payload structure for JWT token.
 */
interface Payload {
  username: string;
  email: string;
  rememberMe: boolean;
}

/**
 * Generates a JWT token based on the provided user information.
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @param {boolean} rememberMe - Indicates if the user wants to be remembered.
 * @returns {string} The generated JWT token.
 * @throws {Error} If the secret key is not provided.
 */
function generateToken(
  username: string,
  email: string,
  rememberMe: boolean,
): string {
  const { secretKey } = process.env;
  const payload: Payload = { username, email, rememberMe };
  const tokenMaxAge = rememberMe ? { expiresIn: '30d' } : {};
  return jwt.sign(payload, secretKey, tokenMaxAge);
}

/**
 * Sets the session cookie with the provided JWT token.
 * @param {Response} res - The response object to set the cookie on.
 * @param {string} token - The JWT token to set in the cookie.
 * @param {boolean} rememberMe - Indicates if the user wants to be remembered.
 */
function setSessionCookie(
  res: Response,
  token: string,
  rememberMe: boolean,
): void {
  const cookieMaxAge = rememberMe ? { maxAge: ms('30d') } : {};
  res.cookie('sessionId', token, {
    httpOnly: true,
    secure: true,
    ...cookieMaxAge,
  });
}

export default { generateToken, setSessionCookie };
