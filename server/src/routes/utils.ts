import express from 'express';
import { HydratedDocument } from 'mongoose';
import User, { IUser, IUserMethods } from '../models/User';

export interface AuthRequest extends express.Request {
    user?: HydratedDocument<IUser, IUserMethods>;
    token?: string
}

export async function Authenticate(req: AuthRequest, res: express.Response, next: express.NextFunction) {
    try {
        let token = req.header('x-auth');

        if(!token) return next();

        let user = await User.findByToken(token);
        if(!user) return next();

        req.user = user;
        req.token = token;
        return next();
    } catch (error) {
        return next();
    }
}

export function ShouldBeLoggedIn(req: AuthRequest, res: express.Response, next: express.NextFunction) {
    if(req.user) return next();
    return res.sendStatus(403);
}

export function ShouldBeLoggedOut(req: AuthRequest, res: express.Response, next: express.NextFunction) {
    if(!req.user) return next();
    return res.sendStatus(403);
}