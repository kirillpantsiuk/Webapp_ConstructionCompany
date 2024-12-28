import React, { useState } from 'react';
import { register } from '../services/authService';

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

    const { username, password, role, name, email, phone, address } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await register(formData);
            console.log(res.data);
            alert('User registered successfully');
        } catch (err) {
            console.error(err.response.data);
            alert('Error registering user');
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
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
