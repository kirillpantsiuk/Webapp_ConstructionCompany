import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import Alert from './Alert';
import '../styles.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [alert, setAlert] = useState(null);

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.login(formData);
      setAlert({ type: 'success', message: 'Login successful!' });
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      setAlert({ type: 'error', message: err.response.data.msg });
    }
  };

  return (
    <div>
      <div className="header">Welcome to the Construction Company App</div>
      {alert && <Alert type={alert.type} message={alert.message} />}
      <form onSubmit={onSubmit}>
        <h2>Login</h2>
        <div>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Login</button>
        <Link to="/register" className="nav-link">
          Don't have an account? Register
        </Link>
      </form>
    </div>
  );
};

export default Login;
