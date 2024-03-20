import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import ms from 'ms';
import jwt from 'jsonwebtoken';
import User from '../models/users/user';
import UserInterface from '../models/users/userInterface';

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
      return res
        .status(400)
        .send({ error: 'Email, username and password are required' });
    }

    return bcrypt
      .hash(password, await bcrypt.genSalt())
      .catch((err) => res.status(401).json({ err }))
      .then((hash) => {
        const user: UserInterface = new User({
          email,
          username,
          password: hash,
        });
        return user.save();
      })
      .then(() => res.status(200).json({ registered: { email, username } }))
      .catch((err) => {
        res.status(401).json({ error: err.message.split(':')[0] });
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
      return res
        .status(400)
        .send({ error: 'Email or username and password are required' });
    }

    const user: UserInterface = await User.findOne({
      $or: [{ email }, { username }],
    }).exec();

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    const isValid: boolean = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const secretKey: jwt.Secret = process.env.secretKey!;
    const rememberMe = !!req.body.rememberMe;
    const payload = {
      username,
      email,
      rememberMe,
    };
    const tokenMaxAge = rememberMe ? { expiresIn: '3s' } : {};
    const cookieMaxAge = rememberMe ? { maxAge: ms('60s') } : {};

    const token = jwt.sign(payload, secretKey, tokenMaxAge);

    res.cookie('sessionId', token, {
      httpOnly: true,
      secure: true,
      ...cookieMaxAge,
    });

    return res.status(200).json({ token });
  }
}

export default UserController;
