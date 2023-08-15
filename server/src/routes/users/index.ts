import express from "express";
import User, {IUser} from '../../models/User';
import { Authenticate, AuthRequest, ShouldBeLoggedIn, ShouldBeLoggedOut } from "../utils";

const router = express.Router();

export default (): express.Router => {

    router.post('/', Authenticate, ShouldBeLoggedOut, async (req: express.Request, res: express.Response) => {
        try {
            const {username, password}: IUser = req.body;

            if(!username || !password) {
                return res.sendStatus(400);
            }

            let user = new User({username, password});
            let token = await user.genAuthToken();
            res.header('x-auth', token).send(user);
        } catch (error) {
            return res.sendStatus(400);
        }
    })

    router.post('/login', Authenticate, ShouldBeLoggedOut, async (req: express.Request, res: express.Response) => {
        try {
            const {username, password} = req.body;
            let user = await User.findByCredentials(username, password);
            if(!user) return res.sendStatus(403);
            let token = await user.genAuthToken();
            res.header('x-auth', token).send(user);
        } catch (error) {
            return res.sendStatus(400);
        }
    })

    router.get('/logout', Authenticate, ShouldBeLoggedIn, async (req: AuthRequest, res: express.Response) => {
        try {
            await req?.user.removeToken(req?.token);
            res.send();
        } catch (error) {
            return res.sendStatus(400);
        }
    })

    router.get('/me', async (req: express.Request, res: express.Response) => {
        try {
            let token = req.header('x-auth');

            if(!token) {
                return res.sendStatus(403);
            }

            let user = await User.findByToken(token);
            if(!user) {
                return res.sendStatus(404);
            }

            res.send(user);
        } catch (error) {
            return res.sendStatus(400);
        }
    })

    return router;
}