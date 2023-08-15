import { Model, Schema, HydratedDocument, model } from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

const KEY = 'sup3rs3cr3tk3y';

type Token = {
    _id: string,
    access: string
}

export interface IUser {
    username: string;
    password: string;
    tokens?: {
        access: string;
        token: string;
    }[];
}

export interface IUserMethods {
    genAuthToken(): Promise<string>;
    removeToken(token: string): Promise<HydratedDocument<IUser, IUserMethods>>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
    findByToken(token: string): Promise<HydratedDocument<IUser, IUserMethods>>;
    findByCredentials(username: string, password: string): Promise<HydratedDocument<IUser, IUserMethods>>;
}

let UserSchema = new Schema<IUser, UserModel, IUserMethods>({
    username: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
}, {timestamps: true});

UserSchema.pre('save', function(next) {
    let user = this;

    if(!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if(err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);
            user.password = hash;
            return next();
        });
    });
})

UserSchema.methods.genAuthToken = function(): Promise<string> {
    let user = this;

    let encode: Token = {_id: user._id.toHexString(), access: 'auth'};

    let token = jwt.sign(encode, KEY);

    user.tokens.push({token, access: 'auth'});

    return user.save().then(() => token);
}

UserSchema.methods.toJSON = function() {
    return {
        username: this.username,
        _id: this._id
    }
}

UserSchema.methods.removeToken = function(token: string): Promise<HydratedDocument<IUser, IUserMethods>> {
    let user = this;
    
    return user.updateOne({
        $pull: {
            tokens: {token}
        }
    })
}

UserSchema.statics.findByCredentials = function(username: string, password: string): Promise<HydratedDocument<IUser, IUserMethods>> {
    let User = this;
    return new Promise((resolve, reject) => {
        User.findOne({username}).then(user => {
            if(!user) return reject();
    
            bcrypt.compare(password, user.password).then(res => {
                if(res) {
                    return resolve(user);
                }
                return reject();
            }).catch(e => reject(e));
        })
    })
}

UserSchema.statics.findByToken = function(token: string): Promise<HydratedDocument<IUser, IUserMethods>> {
    let User = this;
    let decoded: Token;

    try {
        decoded = jwt.verify(token, KEY) as Token;
    } catch(e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.access': decoded.access,
        'tokens.token': token
    });
}

export default model<IUser, UserModel>('User', UserSchema);