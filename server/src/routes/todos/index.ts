import express from "express";
import { Authenticate, AuthRequest, ShouldBeLoggedIn } from "../utils";
import Todo, {ITodo} from '../../models/Todo';

const router = express.Router();

export default (): express.Router => {

    router.post('/', Authenticate, ShouldBeLoggedIn, async (req: AuthRequest, res: express.Response) => {
        try {
            const { text } = req.body;
            let todo = new Todo({text, creator: req.user._id});
            todo = await todo.save();
            return res.send(todo);
        } catch (error) {
            return res.sendStatus(400);
        }
    });

    router.post('/:id', Authenticate, ShouldBeLoggedIn, async (req: AuthRequest, res: express.Response) => {
        try {
            let {text, completed, completedAt}: ITodo = req.body;
            if(!text) return res.sendStatus(400);
            if(!completed) {
                completed = false;
                completedAt = null;
            }
            if(completed && !completedAt) {
                completedAt = Date.now();
            }
            let todo = await Todo.findAndUpdateById(req.params.id, req.user._id, {text, completed, completedAt} as ITodo);
            res.send(todo);
        } catch (error) {
            return res.sendStatus(400);
        }
    })

    router.get('/my-todos', Authenticate, ShouldBeLoggedIn, async (req: AuthRequest, res: express.Response) => {
        try {
            let todos = await Todo.findMyTodos(req.user._id);
            res.send(todos);
        } catch (error) {
            return res.sendStatus(400);
        }
    })

    router.delete('/:id', Authenticate, ShouldBeLoggedIn, async (req: AuthRequest, res: express.Response) => {
        try {
            let todo = await Todo.findAndDeleteById(req.params.id, req.user._id);
            res.send(todo);
        } catch (error) {
            return res.sendStatus(400);
        }
    })

    return router;
}