import React, { useState } from 'react';
import { login } from '../services/authService';

const Login = () => {
    const [formData, setFormData] = useState({
        username: 'alice_jones',
        password: 'securepassword789'
    });

    const { username, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(formData);
            console.log(res.data);
            alert('User logged in successfully');
        } catch (err) {
            console.error(err.response.data);
            alert('Error logging in');
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label>Username</label>
                <input type="text" name="username" value={username} onChange={onChange} required />
            </div>
            <div>
                <label>Password</label>
                <input type="password" name="password" value={password} onChange={onChange} required />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
