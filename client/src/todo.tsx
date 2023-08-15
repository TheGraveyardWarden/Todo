import { useState, useEffect } from 'react';
import { ITodo } from './todo.type';
import { UpdateTodoText, UpdateTodoStatus, DeleteTodo } from './api';

interface TodoProps {
    todo: ITodo;
    setTodos: React.Dispatch<React.SetStateAction<ITodo[]>>
}

function Todo({todo, setTodos}: TodoProps) {
    const [myTodo, setMyTodo] = useState<ITodo>(todo);
    const {text, _id, completed, completedAt} = myTodo;
    const [editing, setEditing] = useState<boolean>(false);
    const [editText, setEditText] = useState<string>(text);
    const [completedAtText, setCompletedAtText] = useState<string>('');

    function onEdit() {
        setEditing(true);
    }

    function onSave() {
        setEditing(false);
        UpdateTodoText(_id as string, editText).then(updatedTodo => {
            setMyTodo(updatedTodo);
        }).catch(e => console.log(e));
    }

    function onStatus() {
        UpdateTodoStatus(_id as string, !completed, text).then(updatedTodo => {
            setMyTodo(updatedTodo);
        }).catch(e => console.log(e));
    }

    function onDel() {
        DeleteTodo(_id as string).then(() => {
            setTodos(prev => {
                return prev.filter(t => t._id !== _id);
            })
        }).catch(() => console.log('unable to delete'));
    }

    useEffect(() => {
        if(!completedAt) return;
        let d = new Date(completedAt as number);
        setCompletedAtText(`${d.getFullYear()}/${d.getMonth()}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`);
    }, [completedAt])

    return (
        <div>
          {editing ? (
            <>
                <input value={editText} onChange={e => setEditText(e.target.value)} placeholder='do wht' />
                <span style={{marginLeft: '1rem'}} onClick={onSave}>save</span>
            </>
          ) : (
            <>
            <span>{text}</span>
            <span style={{marginLeft: '1rem', color: completed ? 'green' : 'red'}}>{completed ? 'done' : 'yet to be done'}</span>
            <span style={{marginLeft: '1rem'}} onClick={onEdit}>edit</span>
            <span onClick={onStatus} style={{marginLeft: '1rem'}}>{completed ? 'Make Undone' : 'Make Done'}</span>
            <span style={{marginLeft: '1rem'}} onClick={onDel}>Del</span>
            {completed ? (
                <span style={{marginLeft: '1rem'}}>{completedAtText}</span>
            ) : ''}
            </>
          )}
        </div>
    )
}

export default Todo;