import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes';

mongoose.Promise = Promise;
mongoose.connect('mongodb://127.0.0.1:27017/todo-app');
mongoose.connection.on('error', () => {
    console.log('error connecting to mongodb');
})

const PORT = 9000;

const app = express();

app.use(cors({
    credentials: true
}));
app.use((req: express.Request, res:express.Response, next: express.NextFunction) => {
    res.header('Access-Control-Expose-Headers', 'x-auth');
    return next();
})
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', routes());

app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));