import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/users';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { ObjectId } from 'mongoose';

type loginField = string | null;
type UsernameEmailErrors = { username: { path: string, message: string }, email: { path: string, message: string } };
type FullError = Error & { code: number, keyPattern: {}, keyValue: {}, errors: UsernameEmailErrors };


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
    static async singUpPost(req: Request<{}, {}, { email: string, username: string, password: string }, {}>, res: Response) {
        const { email, username, password } = req.body;

        if (!email) return res.status(400).send({ error: 'Email is required' });
        if (!username) return res.status(400).send({ error: 'Username is required' });
        if (!password) return res.status(400).send({ error: 'Password is required' });

        const hashedPassowrd: string = await bcrypt.hash(password, await bcrypt.genSalt());
        const user: IUser = new User({
            email, username, password: hashedPassowrd
        });

        try {
            await user.save();
        } catch (err) {
            const error: FullError = err as FullError;
            const errorsToSend: { errors: Record<string, unknown>[] } = { errors: [] };

            if (error.code == 11000) {
                const duplicateKeyField: string = Object.keys(error.keyPattern)[0];
                return res.status(400).json({ error: `${duplicateKeyField}  already exists.` });
            }

            if (error.errors.email) errorsToSend.errors.push({ email: error.errors.email.message });
            if (error.errors.username) errorsToSend.errors.push({ username: error.errors.username.message });

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
    static async loginPost(req: Request<{}, {}, { email: loginField, username: loginField, password: string, remember_me: boolean }, {}>, res: Response) {
        const { email, username, password } = req.body;

        if (!email && !username) return res.status(400).send({ error: 'Email or Username are required' });
        if (!password) return res.status(400).send({ error: 'Pssword is required' });

        const dataToLogInWith = email ? { email: email } : { username: username };

        const user = await User.findOne(dataToLogInWith).exec();
        if (!user) {
            return res.status(404).send({ error: 'User was not found' });
        }

        const isValid: boolean = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const rememberMe: boolean = req.body.remember_me || false;
        const secerKkey: jwt.Secret = process.env.secretKey!;
        const payload = { username: user.username, email: user.email };
        const cookieMaxAge: {} = rememberMe ? { maxAge: ms('60s') } : {};

        const token = jwt.sign(payload, secerKkey, rememberMe ? undefined : { expiresIn: '3d' });

        res.cookie('session_id', token, { httpOnly: true, secure: true, ...cookieMaxAge });

        return res.status(200).json({ token: token });
    }

    static async addToFavorite(req: Request<{}, {}, { playlistURL: string }, {}>, res: Response<{}, { user: IUser }>) {
        const user = res.locals.user;
        const { playlistURL } = req.body;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userId: ObjectId = user._id as ObjectId;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (!user.favorites.includes(playlistURL)) {
            await User.findOneAndUpdate(userId,
                {
                    $push: {
                        favorites: playlistURL
                    }
                });
            return res.status(200).json({
                success: {
                    message: "Playlist was added successfully",
                    playlist: playlistURL,
                    userId: userId
                }
            });
        } else {
            return res.status(406).json({ error: "Playlist already exists in your favorite list" });
        }
    }

    static async removeFromFavorite(req: Request<{}, {}, { playlistURL: string }, {}>, res: Response<{}, { user: IUser }>) {
        const user = res.locals.user;
        const { playlistURL } = req.body;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userId: ObjectId = user._id as ObjectId;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (user.favorites.includes(playlistURL)) {
            await User.findOneAndUpdate(userId,
                {
                    $pull: {
                        favorites: playlistURL
                    }
                });
            return res.status(200).json({
                success: {
                    message: "Playlist deleted successfully",
                    playlist: playlistURL,
                    userId: userId
                }
            });
        } else {
            return res.status(406).json({ error: "Playlist does not exists in your favorite list" });
        }
    }

    static getFavorites(req: Request, res: Response<{}, { user: IUser }>) {
        const user = res.locals.user;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const favorites: [string] = user.favorites;

        return res.status(200).json(favorites);
    }
}

export default UserController;
