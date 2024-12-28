import React, { useState, useContext, useEffect } from 'react';
import { login } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/AuthForm.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const navigate = useNavigate();
    const { setIsAuthenticated, setUserRole } = useContext(AuthContext);

    const { username, password } = formData;

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkTheme(savedTheme === 'dark');
            document.body.classList.toggle('dark-theme', savedTheme === 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkTheme;
        setIsDarkTheme(newTheme);
        document.body.classList.toggle('dark-theme', newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(formData);
            if (res && res.data) {
                console.log(res.data);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify({ role: res.data.user.role }));
                setIsAuthenticated(true);
                setUserRole(res.data.user.role);
                navigate('/dashboard'); // Перенаправление на панель управления
            } else {
                alert('Error logging in');
            }
        } catch (err) {
            console.error(err.response?.data?.msg || 'Error logging in');
            alert(err.response?.data?.msg || 'Error logging in');
        }
    };

    return (
        <div className="auth-form">
            <h2>Login</h2>
            <button onClick={toggleTheme} style={{ marginBottom: '20px' }}>
                Toggle {isDarkTheme ? 'Light' : 'Dark'} Theme
            </button>
            <form onSubmit={onSubmit}>
                <div className="form-grid">
                    <div>
                        <label>Username</label>
                        <input type="text" name="username" value={username} onChange={onChange} required />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} required />
                    </div>
                </div>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
};

export default Login;
