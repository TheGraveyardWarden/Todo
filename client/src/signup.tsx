import { useState } from 'react';
import { ApiSignup } from './api';
import { User, UserContext } from './UserContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

function Signup() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { setUser } = useContext(UserContext);

    async function handleOnClick() {
        try {
            let user: User | null = await ApiSignup(username, password);
            setUser(user);
        } catch (error) {
            setUser(null);
        }
    }

    return <div>
        <h1>SIGNUP</h1>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder='username' />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder='password' />
        <button onClick={handleOnClick}>Submit</button>
        <Link to={'/login'}>LOGIN</Link>
    </div>
}

export default Signup;