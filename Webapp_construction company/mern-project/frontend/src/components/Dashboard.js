// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#1B1D1E',
      color: theme === 'light' ? '#000000' : '#C13B00',
      padding: '20px',
      boxSizing: 'border-box',
    },
    themeButton: {
      position: 'absolute',
      top: '20px',
      right: '100px', // Сдвигаем кнопку темы вправо
      backgroundColor: theme === 'light' ? '#000000' : '#C13B00',
      color: '#FFFFFF',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'background-color 0.3s, transform 0.3s',
    },
    logoutButton: {
      position: 'absolute',
      top: '20px',
      right: '20px', // Кнопка выхода в правом верхнем углу
      backgroundColor: theme === 'light' ? '#000000' : '#C13B00',
      color: '#FFFFFF',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'background-color 0.3s, transform 0.3s',
    },
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: '20px',
    },
    header: {
      margin: 0,
      color: theme === 'light' ? '#000000' : '#C13B00',
    },
    contentContainer: {
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#1B1D1E',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '600px',
      width: '100%',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
  };

  return (
    <div style={styles.container}>
      <button style={styles.themeButton} onClick={toggleTheme}>
        {theme === 'light' ? 'Темна тема' : 'Світла тема'}
      </button>
      <button style={styles.logoutButton}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#FFA500')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = theme === 'light' ? '#000000' : '#C13B00')}
              onClick={handleLogout}>
        Вийти
      </button>
      <div style={styles.headerContainer}>
        <h2 style={styles.header}>Панель управління</h2>
      </div>
      <div style={styles.contentContainer}>
        <p>Ласкаво просимо на панель управління!</p>
      </div>
    </div>
  );
};

export default Dashboard;