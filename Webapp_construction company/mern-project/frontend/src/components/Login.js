import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      alert('Login successful');
      navigate('/dashboard'); // Перенаправление на главную страницу после входа
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Авторизация</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
      <p style={styles.link}>
        Еще не зарегистрированы? <span onClick={() => navigate('/register')} style={styles.linkText}>Зарегистрироваться</span>
      </p>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#1B1D1E',
    color: '#C13B00',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '400px',
    margin: '0 auto',
    textAlign: 'center',
  },
  header: {
    color: '#C13B00',
    fontSize: '24px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#5E4D7C',
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#C13B00',
    color: '#FFFFFF',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    color: '#FF0000',
    marginTop: '10px',
  },
  link: {
    marginTop: '20px',
  },
  linkText: {
    color: '#C13B00',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Login;
