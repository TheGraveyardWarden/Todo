import { Schema, model, Model, HydratedDocument, Types } from "mongoose";

export interface ITodo {
    text: string;
    creator: Types.ObjectId;
    completed?: boolean;
    completedAt?: number;
}

interface TodoModel extends Model<ITodo, {}> {
    findAndUpdateById(todoId: string, userId: Types.ObjectId, obj: ITodo): Promise<HydratedDocument<ITodo>>;
    findMyTodos(userId: Types.ObjectId): Promise<HydratedDocument<ITodo>[]>;
    findAndDeleteById(todoId: string, userId: Types.ObjectId): Promise<HydratedDocument<ITodo>>;
}

let TodoSchema =  new Schema<ITodo, TodoModel>({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

TodoSchema.methods.toJSON = function() {
    return {
        text: this.text,
        completed: this.completed,
        completedAt: this.completedAt,
        _id: this._id
    }
}

TodoSchema.statics.findAndUpdateById = function(todoId: string, userId: Types.ObjectId, obj: ITodo): Promise<HydratedDocument<ITodo>> {
    let Todo = this;
    return new Promise((resolve, reject) => {
        Todo.findOne({_id: todoId}).then(todo => {
            if(!todo) return reject("no todos found");
            if(!todo.creator.equals(userId)) {
                return reject("ur not the owner of this todo");
            }
            todo.updateOne(obj).then(() => {
                return resolve(Todo.findById(todo._id));
            }).catch(e => reject(e));
        });
    });
}

TodoSchema.statics.findMyTodos = function(userId: Types.ObjectId): Promise<HydratedDocument<ITodo>[]> {
    let Todo = this;
    return Todo.find({creator: userId});
}

TodoSchema.statics.findAndDeleteById = function(todoId: string, userId: Types.ObjectId): Promise<HydratedDocument<ITodo>> {
    let Todo = this;
    return Todo.findOneAndDelete({_id: todoId, creator: userId});
}

export default model<ITodo, TodoModel>('Todo', TodoSchema);