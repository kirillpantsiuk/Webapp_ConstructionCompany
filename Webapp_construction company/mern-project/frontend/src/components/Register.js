// src/components/Register.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password, role, name, email, phone, address });
      alert('Реєстрація успішна');
      navigate('/login');
    } catch (error) {
      setError('Реєстрація не вдалася. Спробуйте ще раз.');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#1B1D1E',
      color: theme === 'light' ? '#000000' : '#C13B00',
    },
    themeButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      backgroundColor: theme === 'light' ? '#000000' : '#C13B00',
      color: '#FFFFFF',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'background-color 0.3s, transform 0.3s',
    },
    formContainer: {
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#1B1D1E',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '400px',
      width: '100%',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    header: {
      color: theme === 'light' ? '#000000' : '#C13B00',
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
      border: '1px solid ' + (theme === 'light' ? '#000000' : '#C13B00'),
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#5E4D7C',
      color: theme === 'light' ? '#000000' : '#FFFFFF',
      transition: 'border-color 0.3s',
    },
    button: {
      backgroundColor: theme === 'light' ? '#000000' : '#C13B00',
      color: '#FFFFFF',
      padding: '10px',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'background-color 0.3s, transform 0.3s',
    },
    error: {
      color: '#FF0000',
      marginTop: '10px',
    },
    link: {
      marginTop: '20px',
    },
    linkText: {
      color: theme === 'light' ? '#000000' : '#C13B00',
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  };

  return (
    <div style={styles.container}>
      <button style={styles.themeButton} onClick={toggleTheme}>
        {theme === 'light' ? 'Темна тема' : 'Світла тема'}
      </button>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>Реєстрація</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Ім'я користувача"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            style={styles.input}
          >
            <option value="">Оберіть роль</option>
            <option value="Builder">Будівельник</option>
            <option value="Foreman">Прораб</option>
            <option value="ProjectManager">Начальник об'єкту</option>
            <option value="Customer">Замовник</option>
            <option value="Director">Директор</option>
          </select>
          <input
            type="text"
            placeholder="Ім'я"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Електронна пошта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Адреса"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#FFA500')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = theme === 'light' ? '#000000' : '#C13B00')}>
            Зареєструватися
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
        <p style={styles.link}>
          Вже зареєстровані? <span onClick={() => navigate('/login')} style={styles.linkText}>Увійти</span>
        </p>
      </div>
    </div>
  );
};

export default Register;