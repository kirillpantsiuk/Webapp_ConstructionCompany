// src/components/Users.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#1B1D1E',
      color: '#C13B00',
      padding: '20px',
      boxSizing: 'border-box',
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
      color: '#C13B00',
    },
    contentContainer: {
      backgroundColor: '#1B1D1E',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '600px',
      width: '100%',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    backButton: {
      backgroundColor: '#C13B00',
      color: '#FFFFFF',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'background-color 0.3s, transform 0.3s',
    },
    userItem: {
      marginBottom: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h2 style={styles.header}>Облік працівників</h2>
        <button style={styles.backButton} onClick={() => navigate('/dashboard')}>
          Назад
        </button>
      </div>
      <div style={styles.contentContainer}>
        {users.map(user => (
          <div key={user._id} style={styles.userItem}>
            <p>Ім'я користувача: {user.username}</p>
            <p>Роль: {user.role}</p>
            <p>Ім'я: {user.profileId.name}</p>
            <p>Електронна пошта: {user.profileId.email}</p>
            <p>Телефон: {user.profileId.phone}</p>
            <p>Адреса: {user.profileId.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
