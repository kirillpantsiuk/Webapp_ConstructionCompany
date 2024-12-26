// src/components/Teams.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teams', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTeams(response.data);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
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
    teamItem: {
      marginBottom: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h2 style={styles.header}>Формування бригад</h2>
        <button style={styles.backButton} onClick={() => navigate('/dashboard')}>
          Назад
        </button>
      </div>
      <div style={styles.contentContainer}>
        {teams.map(team => (
          <div key={team._id} style={styles.teamItem}>
            <p>Назва: {team.name}</p>
            <p>Члени команди:</p>
            <ul>
              {team.members.map(member => (
                <li key={member._id}>{member.userId.username}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;
