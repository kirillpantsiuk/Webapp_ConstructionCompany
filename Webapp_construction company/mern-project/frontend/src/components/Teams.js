// src/components/Teams.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSignOutAlt, FaUser, FaSun, FaMoon, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    members: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme;
    fetchTeams();
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUser(decodedToken.username);
    }
  }, [theme]);

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

  const handleAddTeam = () => {
    setShowAddForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeam({ ...newTeam, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/teams', newTeam, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchTeams(); // Обновить список команд после добавления
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add team:', error);
    }
  };

  const handleEditTeam = async (id) => {
    const updatedTeam = {
      name: 'Updated Team Name',
      members: ['member_id_here'] // Замените на идентификаторы пользователей
    };

    try {
      await axios.put(`http://localhost:5000/api/teams/${id}`, updatedTeam, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchTeams(); // Обновить список команд после редактирования
    } catch (error) {
      console.error('Failed to edit team:', error);
    }
  };

  const handleDeleteTeam = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/teams/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchTeams(); // Обновить список команд после удаления
    } catch (error) {
      console.error('Failed to delete team:', error);
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
    teamItem: {
      marginBottom: '10px',
    },
    actionButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: theme === 'light' ? '#000000' : '#FFFFFF',
      marginRight: '5px',
    },
    formContainer: {
      display: showAddForm ? 'block' : 'none',
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#1B1D1E',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '600px',
      width: '100%',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      marginBottom: '20px',
    },
    formInput: {
      marginBottom: '10px',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid ' + (theme === 'light' ? '#000000' : '#C13B00'),
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#5E4D7C',
      color: theme === 'light' ? '#000000' : '#FFFFFF',
      transition: 'border-color 0.3s',
    },
    formButton: {
      backgroundColor: theme === 'light' ? '#000000' : '#C13B00',
      color: '#FFFFFF',
      padding: '10px',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'background-color 0.3s, transform 0.3s',
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
        <button style={styles.actionButton} onClick={handleAddTeam}>
          <FaPlus /> Додати команду
        </button>
        {showAddForm && (
          <form style={styles.formContainer} onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Назва команди"
              value={newTeam.name}
              onChange={handleInputChange}
              style={styles.formInput}
              required
            />
            <button type="submit" style={styles.formButton}>
              Додати
            </button>
          </form>
        )}
        {teams.map(team => (
          <div key={team._id} style={styles.teamItem}>
            <p>Назва: {team.name}</p>
            <p>Члени:</p>
            <ul>
              {team.members.map(member => (
                <li key={member._id}>{member.profileId.name}</li>
              ))}
            </ul>
            <button style={styles.actionButton} onClick={() => handleEditTeam(team._id)}>
              <FaEdit /> Редагувати
            </button>
            <button style={styles.actionButton} onClick={() => handleDeleteTeam(team._id)}>
              <FaTrash /> Видалити
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;
