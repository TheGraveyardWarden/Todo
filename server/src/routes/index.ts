import express from "express";
import userRoutes from './users';
import todoRoutes from './todos';

const router = express.Router();

export default (): express.Router => {

    router.use('/users', userRoutes());
    router.use('/todos', todoRoutes());

    return router;
}