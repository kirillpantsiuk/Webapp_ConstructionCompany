// src/components/WorkSchedules.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WorkSchedules = () => {
  const [workSchedules, setWorkSchedules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkSchedules();
  }, []);

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
    workScheduleItem: {
      marginBottom: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h2 style={styles.header}>Формування розкладу роботи</h2>
        <button style={styles.backButton} onClick={() => navigate('/dashboard')}>
          Назад
        </button>
      </div>
      <div style={styles.contentContainer}>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkSchedules;
