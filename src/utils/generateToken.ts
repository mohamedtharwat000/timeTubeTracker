import jwt from 'jsonwebtoken';

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
  rememberMe?: boolean,
): string {
  const { secretKey } = process.env;
  const payload: {
    username: string;
    email: string;
    rememberMe: boolean;
  } = { username, email, rememberMe };
  const tokenMaxAge = rememberMe ? { expiresIn: '30d' } : { expiresIn: '1d' };
  return jwt.sign(payload, secretKey, tokenMaxAge);
}

export default generateToken;
