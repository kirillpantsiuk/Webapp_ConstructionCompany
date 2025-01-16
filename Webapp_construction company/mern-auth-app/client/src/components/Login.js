// src/components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import Alert from './Alert';
import '../styles.css';

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.login(formData);
      if (res && res.data && res.data.token) {
        setAlert({ type: 'success', message: 'Login successful!' });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.user.username);
        localStorage.setItem('role', res.data.user.role);
        const expirationDate = new Date(new Date().getTime() + 3600000); // 1 hour
        localStorage.setItem('expirationDate', expirationDate.toISOString());
        setIsAuthenticated(true);

        const userRole = res.data.user.role;
        let path = '';
        switch (userRole) {
          case 'builder':
            path = '/builder-dashboard';
            break;
          case 'foreman':
            path = '/foreman-dashboard';
            break;
          case 'project_manager':
            path = '/project-manager-dashboard';
            break;
          case 'client':
            path = '/client-dashboard';
            break;
          case 'director':
            path = '/director-dashboard';
            break;
          default:
            path = '/dashboard';
        }

        localStorage.setItem('lastPath', path);
        navigate(path);
      } else {
        setAlert({ type: 'error', message: 'Invalid response from server' });
      }
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
