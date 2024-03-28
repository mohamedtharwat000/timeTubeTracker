import { Request, Response } from 'express';
import validator from 'validator';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken';
import setSessionCookie from '../utils/setSessionCookie';
import User, { UserInterface } from '../models/user';

/**
 * Class representing user controller methods.
 */
class UserController {
  /**
   * Handle user sign up.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<Response>} A promise containing the response.
   */
  static async signUp(req: Request, res: Response): Promise<Response> {
    const { username, email, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).send({
        error: {
          username: !username ? 'Username is required.' : null,
          email: !email ? 'Email is required.' : null,
          password: !password ? 'Password is required.' : null,
        },
      });
    }

    const ifValidEmail: boolean = validator.isEmail(email);
    const ifValidUsername: boolean = validator.isAlphanumeric(username);
    const ifValidPassword: boolean = validator.isStrongPassword(password, {
      minLength: 5,
      minNumbers: 1,
      minUppercase: 0,
      minSymbols: 0,
    });

    if (!ifValidEmail) {
      return res.status(400).json({ error: { email: 'Invalid Email' } });
    }

    if (!ifValidUsername) {
      return res.status(400).json({
        error: { username: 'Invalid Username! Only Alphanumeric words' },
      });
    }

    if (!ifValidPassword) {
      return res
        .status(400)
        .json({ error: { password: 'Please enter a stronger Password' } });
    }

    return bcrypt
      .hash(password, await bcrypt.genSalt())
      .catch((err) => res.status(401).json({ err }))
      .then((hash) => {
        const user: UserInterface = new User({
          email,
          username,
          password: hash,
          favorites: [],
        });
        return user.save();
      })
      .then(() => res.status(200).json({ registered: { email, username } }))
      .catch((err) => {
        if (err.code === 11000) {
          const duplicateKeyField: string = Object.keys(err.keyValue)[0];
          return res.status(400).json({
            error: {
              [duplicateKeyField]: `${duplicateKeyField} already exists.`,
            },
          });
        }
        return res.status(400).json({
          error: err.message,
        });
      })
      .then(() => res);
  }

  /**
   * Handle user login.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<Response>} A promise containing the response.
   */
  static async login(req: Request, res: Response): Promise<Response> {
    const { username, email, password } = req.body;

    if ((!email && !username) || !password) {
      return res.status(400).send({
        error: {
          usernameOrEmail:
            !email || !username ? 'Email or Username are required.' : null,
          password: !password ? 'Password is required.' : null,
        },
      });
    }

    const user: UserInterface = await User.findOne({
      $or: [{ email }, { username }],
    }).exec();

    if (!user) {
      return res
        .status(404)
        .send({ error: { usernameOrEmail: 'Email/Username was not found' } });
    }

    const isValidPassword: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isValidPassword) {
      return res
        .status(404)
        .json({ error: { password: 'Incorrect password' } });
    }

    const token: string = generateToken(
      user.username,
      user.email,
      !!req.body.rememberMe,
    );

    setSessionCookie(res, token, !!req.body.rememberMe);

    return res.status(200).json({ token });
  }

  /**
   * GET /api/logout
   * Logout a user from the session
   * And save the token to the blacklist cache list
   *
   * @static
   * @param {Request} req - express Request contains the session_id cookie
   * @param {Response} res - express Response
   */
  static logout(req: Request, res: Response) {
    res.clearCookie('sessionId');

    return res.redirect('/');
  }
}

export default UserController;
