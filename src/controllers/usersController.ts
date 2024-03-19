import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/users';

type loginField = string | null;
type UsernameEmailErrors = { username: { path: string, message: string }, email: {  path: string, message: string }  };
type ErrorWithCode = Error & { code: number, keyPattern: {}, keyValue: {}, errors : UsernameEmailErrors };

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

        if (!email) return res.status(400).send({ error: 'Missing email' });
        if (!username) return res.status(400).send({ error: 'Missing username' });
        if (!password) return res.status(400).send({ error: 'Missing password' });

        const hashedPassowrd: string = await bcrypt.hash(password, await bcrypt.genSalt());
        const user: IUser = new User({
            email, username, password: hashedPassowrd
        });

        try {
            await user.save();
        } catch (err) {
            const error: ErrorWithCode = err as ErrorWithCode;
            const errorsToSend: { error: Record<string, unknown>[] } = { error: [] };

            if (error.code == 11000) {
                const duplicateKeyField: string = Object.keys(error.keyPattern)[0];
                return res.status(400).json({ error: `Duplication in ${duplicateKeyField}` });
            }

            if (error.errors.email) {
                errorsToSend['error'].push({ email:  error.errors.email.message });
            }

            if (error.errors.username) {
                errorsToSend['error'].push({ username:  error.errors.username.message });
            }
            // console.log(error.errors.username?.kind);
            // console.log(error.errors.email?.kind);
            // console.log(error.code);
            // console.log(error.keyPattern);
            // console.log(error.keyValue);

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
    static async loginPost(req: Request<{}, {}, { email: loginField, username: loginField, password: string }, {}>, res: Response) {
        const { email, username, password } = req.body;

        if (!email && !username) return res.status(400).send({ error: 'Missing email and username' });
        if (!password) return res.status(400).send({ error: 'Missing password' });

        const dataToLogInWith = email ? { email: email } : { username: username };

        const user = await User.findOne(dataToLogInWith).exec();
        if (!user) {
            return res.status(404).send({ error: 'User was not found' });
        }

        const isValid: boolean = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        return res.status(200).json({ token: "token111" });
    }
}

export default UserController;
