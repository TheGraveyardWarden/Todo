import './App.css';
import { UserContext } from './UserContext';
import { useContext, useState, useEffect } from 'react';
import { ApiLogout, PostTodo, GetMyTodos } from './api';
import { ITodo } from './todo.type';
import Todo from './todo';

function App() {
  const { user, setUser } = useContext(UserContext);
  const [todoText, setTodoText] = useState<string>('');
  const [todos, setTodos] = useState<ITodo[]>([]);

  function onLogout() {
    ApiLogout().then(() => setUser(null)).catch(e => console.log(e));
  }

  function handleTodoAdd() {
    if(!todoText) return;
    PostTodo({text: todoText}).then(todo => {
      setTodos(prev => {
        return [...prev, todo];
      });
    }).catch(e => console.log(e));
    setTodoText('');
  }

  useEffect(() => {
    GetMyTodos().then(todos => {
      setTodos(todos);
    }).catch(e => setTodos([]));
  }, []);

  return (
    <div className="App">
      <h1>Hello {user?.username}</h1>
      <button onClick={onLogout}>LOGOUT</button><br/>
      <h2>New Todo</h2>
      <input value={todoText} onChange={e => setTodoText(e.target.value)} placeholder='ima do this ima do that' />
      <button onClick={handleTodoAdd}>Add</button><br/>
      {todos.map(todo => (
        <Todo key={todo._id} todo={todo} setTodos={setTodos} />
      ))}
    </div>
  );
}

export default App;
