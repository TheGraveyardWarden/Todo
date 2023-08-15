import { useState, useContext } from 'react';
import { ApiLogin } from './api';
import { UserContext } from './UserContext';
import { Link } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { setUser } = useContext(UserContext);

    function handleOnClick() {
        ApiLogin(username, password).then(user => {
            setUser(user);
        }).catch(e => {
            setUser(null);
        });
    }

    return <div>
        <h1>LOGIN</h1>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder='username' />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder='password' />
        <button onClick={handleOnClick}>Submit</button>
        <Link to={'/signup'}>SIGNUP</Link>
    </div>
}

export default Login;