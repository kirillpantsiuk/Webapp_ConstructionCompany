// src/components/BuilderDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaSun, FaMoon } from 'react-icons/fa';

const BuilderDashboard = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.body.className = theme;
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUser(decodedToken.username);
    }
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
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: '20px',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
    },
    username: {
      marginRight: '10px',
      fontWeight: 'bold',
    },
    themeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: theme === 'light' ? '#000000' : '#FFFFFF',
    },
    logoutButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: theme === 'light' ? '#000000' : '#FFFFFF',
    },
    menuContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    menuButton: {
      backgroundColor: theme === 'light' ? '#000000' : '#C13B00',
      color: '#FFFFFF',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      margin: '10px',
      transition: 'background-color 0.3s, transform 0.3s',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          {theme === 'light' ? (
            <FaSun style={styles.themeButton} onClick={toggleTheme} />
          ) : (
            <FaMoon style={styles.themeButton} onClick={toggleTheme} />
          )}
        </div>
        <div style={styles.userInfo}>
          <FaUser />
          <span style={styles.username}>{user}</span>
          <FaSignOutAlt style={styles.logoutButton} onClick={handleLogout} />
        </div>
      </div>
      <div style={styles.menuContainer}>
        <button style={styles.menuButton} onClick={() => navigate('/work-schedules')}>
          Перегляд розкладу роботи
        </button>
      </div>
    </div>
  );
};

export default BuilderDashboard;
