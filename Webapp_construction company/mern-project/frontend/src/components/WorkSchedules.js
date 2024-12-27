// src/components/WorkSchedules.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSignOutAlt, FaUser, FaSun, FaMoon, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const WorkSchedules = () => {
  const [workSchedules, setWorkSchedules] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorkSchedule, setNewWorkSchedule] = useState({
    teamId: '',
    tasks: [
      {
        taskName: '',
        deadline: '',
        assignedTo: ''
      }
    ]
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = theme;
    fetchWorkSchedules();
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUser(decodedToken.username);
    }
  }, [theme]);

  const fetchWorkSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/work-schedules', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setWorkSchedules(response.data);
    } catch (error) {
      console.error('Failed to fetch work schedules:', error);
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

  const handleAddWorkSchedule = () => {
    setShowAddForm(true);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedTasks = newWorkSchedule.tasks.map((task, i) =>
      index === i ? { ...task, [name]: value } : task
    );
    setNewWorkSchedule({ ...newWorkSchedule, tasks: updatedTasks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/work-schedules', newWorkSchedule, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchWorkSchedules(); // Обновить список графиков работ после добавления
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add work schedule:', error);
    }
  };

  const handleEditWorkSchedule = async (id) => {
    const updatedWorkSchedule = {
      teamId: 'team_id_here', // Замените на идентификатор команды
      tasks: [
        {
          taskName: 'Updated Task 1',
          deadline: '2023-12-31',
          assignedTo: 'user_id_here' // Замените на идентификатор пользователя
        },
        {
          taskName: 'Updated Task 2',
          deadline: '2023-12-31',
          assignedTo: 'user_id_here' // Замените на идентификатор пользователя
        }
      ]
    };

    try {
      await axios.put(`http://localhost:5000/api/work-schedules/${id}`, updatedWorkSchedule, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchWorkSchedules(); // Обновить список графиков работ после редактирования
    } catch (error) {
      console.error('Failed to edit work schedule:', error);
    }
  };

  const handleDeleteWorkSchedule = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/work-schedules/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchWorkSchedules(); // Обновить список графиков работ после удаления
    } catch (error) {
      console.error('Failed to delete work schedule:', error);
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
    workScheduleItem: {
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
        <button style={styles.actionButton} onClick={handleAddWorkSchedule}>
          <FaPlus /> Додати графік
        </button>
        {showAddForm && (
          <form style={styles.formContainer} onSubmit={handleSubmit}>
            <input
              type="text"
              name="teamId"
              placeholder="Team ID"
              value={newWorkSchedule.teamId}
              onChange={(e) => setNewWorkSchedule({ ...newWorkSchedule, teamId: e.target.value })}
              style={styles.formInput}
              required
            />
            {newWorkSchedule.tasks.map((task, index) => (
              <div key={index}>
                <input
                  type="text"
                  name="taskName"
                  placeholder="Task Name"
                  value={task.taskName}
                  onChange={(e) => handleInputChange(e, index)}
                  style={styles.formInput}
                  required
                />
                <input
                  type="date"
                  name="deadline"
                  value={task.deadline}
                  onChange={(e) => handleInputChange(e, index)}
                  style={styles.formInput}
                  required
                />
                <input
                  type="text"
                  name="assignedTo"
                  placeholder="Assigned To"
                  value={task.assignedTo}
                  onChange={(e) => handleInputChange(e, index)}
                  style={styles.formInput}
                  required
                />
              </div>
            ))}
            <button type="submit" style={styles.formButton}>
              Додати
            </button>
          </form>
        )}
        {workSchedules.map(workSchedule => (
          <div key={workSchedule._id} style={styles.workScheduleItem}>
            <p>Команда: {workSchedule.teamId.name}</p>
            <p>Завдання:</p>
            <ul>
              {workSchedule.tasks.map(task => (
                <li key={task._id}>
                  {task.taskName} (Дедлайн: {new Date(task.deadline).toLocaleDateString()}, Виконавець: {task.assignedTo.username})
                </li>
              ))}
            </ul>
            <button style={styles.actionButton} onClick={() => handleEditWorkSchedule(workSchedule._id)}>
              <FaEdit /> Редагувати
            </button>
            <button style={styles.actionButton} onClick={() => handleDeleteWorkSchedule(workSchedule._id)}>
              <FaTrash /> Видалити
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkSchedules;
