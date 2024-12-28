import React, { useState, useEffect } from 'react';
import { register } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AuthForm.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'Builder',
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const navigate = useNavigate();

    const { username, password, role, name, email, phone, address } = formData;

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
            const res = await register(formData);
            if (res && res.data) {
                console.log(res.data);
                alert('User registered successfully');
                navigate('/login'); // Перенаправление на форму авторизации
            } else {
                alert('Error registering user');
            }
        } catch (err) {
            console.error(err.response?.data?.msg || 'Error registering user');
            alert(err.response?.data?.msg || 'Error registering user');
        }
    };

    return (
        <div className="auth-form">
            <h2>Register</h2>
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
                    <div>
                        <label>Role</label>
                        <select name="role" value={role} onChange={onChange} required>
                            <option value="Builder">Builder</option>
                            <option value="Foreman">Foreman</option>
                            <option value="ProjectManager">Project Manager</option>
                            <option value="Customer">Customer</option>
                            <option value="Director">Director</option>
                        </select>
                    </div>
                    <div>
                        <label>Name</label>
                        <input type="text" name="name" value={name} onChange={onChange} required />
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="email" name="email" value={email} onChange={onChange} required />
                    </div>
                    <div>
                        <label>Phone</label>
                        <input type="text" name="phone" value={phone} onChange={onChange} required />
                    </div>
                    <div>
                        <label>Address</label>
                        <input type="text" name="address" value={address} onChange={onChange} />
                    </div>
                </div>
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    );
};

export default Register;
