// src/components/Teams.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSignOutAlt, FaUser, FaSun, FaMoon } from 'react-icons/fa';

const Teams = () => {
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

  const handleReturnToDashboard = () => {
    const role = localStorage.getItem('role');
    if (role === 'Foreman') {
      navigate('/foreman-dashboard');
    } else if (role === 'Builder') {
      navigate('/builder-dashboard');
    }
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
    backButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: theme === 'light' ? '#000000' : '#FFFFFF',
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
      <div style={styles.header}>
        <FaArrowLeft style={styles.backButton} onClick={handleReturnToDashboard} />
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
      <div style={styles.contentContainer}>
        {/* Здесь будет ваш контент для команд */}
      </div>
    </div>
  );
};

export default Teams;
