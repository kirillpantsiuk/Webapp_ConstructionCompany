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
        setIsAuthenticated(true);

        // Получаем роль пользователя
        const userRole = res.data.user.role;

        // Перенаправляем на соответствующую страницу в зависимости от роли
        switch (userRole) {
          case 'builder':
            navigate('/builder-dashboard');
            break;
          case 'foreman':
            navigate('/foreman-dashboard');
            break;
          case 'project_manager':
            navigate('/project-manager-dashboard');
            break;
          case 'client':
            navigate('/client-dashboard');
            break;
          case 'director':
            navigate('/director-dashboard');
            break;
          default:
            navigate('/dashboard');
        }
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
