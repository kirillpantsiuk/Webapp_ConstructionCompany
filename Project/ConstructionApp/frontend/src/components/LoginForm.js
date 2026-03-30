import React, { useState } from 'react';
import './LoginForm.css';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/superadmin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({ type: 'success', message: data.message });
        setTimeout(() => {
          navigate('/dashboard'); // ✅ редирект на Dashboard
        }, 1500);
      } else {
        setAlert({ type: 'error', message: data.message });
      }
    } catch (error) {
      console.error('Login error:', error);
      setAlert({ type: 'error', message: '❌ Server error' });
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back 👋</h2>
      <p>
        Today is a new day. It's your day. You shape it.<br />
        Sign in to start managing your projects.
      </p>

      {alert && (
        <Alert severity={alert.type} style={{ marginBottom: '20px' }}>
          <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          {alert.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        <label>Email</label>
        <input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="forgot-password">
          <a href="/forgot-password">Forgot Password?</a>
        </div>

        <button type="submit" className="login-button">Sign in</button>
      </form>
    </div>
  );
};

export default LoginForm;
