import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import User, { IUser } from '../models/users';

type loginField = string | null;
type UsernameEmailErrors = {
    username: { path: string; message: string };
    email: { path: string; message: string };
};
type FullError = Error & {
    code: number;
    keyPattern: {};
    keyValue: {};
    errors: UsernameEmailErrors;
};

/**
 * The User Controller for signup, login, etc...
 */
class UserController {
    /**
     * POST /api/signup
     * Sign up a new user
     *
     * @static
     * @async
     * @param {Request<{}, {}, {email: string, username: string, password: string}, {}>} req -  express Request
     * contains the mandatory fields: email, username, and password.
     * @param {Response} res -  express Response
     */
    static async singUpPost(
        req: Request<
        {},
        {},
        { email: string; username: string; password: string },
        {}
        >,
        res: Response,
    ) {
        const { email, username, password } = req.body;

        if (!email) return res.status(400).send({ error: 'Email is required' });
        if (!username) return res.status(400).send({ error: 'Username is required' });
        if (!password) return res.status(400).send({ error: 'Password is required' });

        const hashedPassowrd: string = await bcrypt.hash(
            password,
            await bcrypt.genSalt(),
        );
        const user: IUser = new User({
            email,
            username,
            password: hashedPassowrd,
        });

        try {
            await user.save();
        } catch (err) {
            const error: FullError = err as FullError;
            const errorsToSend: { errors: Record<string, unknown>[] } = {
                errors: [],
            };

            if (error.code == 11000) {
                const duplicateKeyField: string = Object.keys(
                    error.keyPattern,
                )[0];
                return res
                    .status(400)
                    .json({ error: `${duplicateKeyField}  already exists.` });
            }

            if (error.errors.email) errorsToSend.errors.push({ email: error.errors.email.message });
            if (error.errors.username) {
            {
errorsToSend.errors.push({
                username: error.errors.username.message,
            });
            }

            return res.status(401).json(errorsToSend);
        }

        return res.status(200).json({ registerd: { email, username } });
    }

    /**
     * POST /api/login
     * login a new user and add a JWT token as cookie session_id
     *
     * @static
     * @async
     * @param {Request<{}, {}, { email: loginField, username: loginField, password: string}, {}>} req - express Request
     * contains the mandatory: email || username, and password
     * @param {Response} res - express Response
     */
    static async loginPost(
        req: Request<
        {},
        {},
        {
            email: loginField;
            username: loginField;
            password: string;
            remember_me: boolean;
        },
        {}
        >,
        res: Response,
    ) {
        const { email, username, password } = req.body;

        if (!email && !username) {
        {
return res
            .status(400)
            .send({ error: 'Email or Username are required' });
        }
        if (!password) return res.status(400).send({ error: 'Pssword is required' });

        const dataToLogInWith = email ? { email } : { username };

        const user = await User.findOne(dataToLogInWith).exec();
        if (!user) {
            return res.status(404).send({ error: 'User was not found' });
        }

        const isValid: boolean = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const remember_me: boolean = req.body.remember_me || false;
        const secert_key: jwt.Secret = process.env.secretKey!;
        const payload = { username: user.username, email: user.email };
        const cookieMaxAge: {} = remember_me ? { maxAge: ms('60s') } : {};

        const token = jwt.sign(
            payload,
            secert_key,
            remember_me ? undefined : { expiresIn: '3d' },
        );

        res.cookie('session_id', token, {
            httpOnly: true,
            secure: true,
            ...cookieMaxAge,
        });

        return res.status(200).json({ token });
    }
}

export default UserController;
