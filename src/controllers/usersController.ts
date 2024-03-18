import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/users';


class UserController {
    static async singUpPost(req: Request, res: Response) {
        const { email, username, password } = (req.body as { email: string; username: string; password: string });

        if (!email) return res.status(400).send({ error: 'Missing email' });
        if (!username) return res.status(400).send({ error: 'Missing username' });
        if (!password) return res.status(400).send({ error: 'Missing password' });

        const hashedPassowrd: string = await bcrypt.hash(password, await bcrypt.genSalt());
        const user: IUser = new User({
            email, username, password: hashedPassowrd
        });

        await user.save();

        return res.status(200).json({ email, username });
    }

    static async loginPost(req: Request, res: Response) {
        const { email, username, password } = (req.body as { email: string | null; username: string | null; password: string });

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

        return res.status(200).json({token: "token111"});
    }
}

export default UserController;
