import React from 'react';
import '../styles.css';

const ProjectManagerDashboard = () => {
  const username = localStorage.getItem('username');

  return (
    <div>
      <h2>Project Manager Dashboard</h2>
      {username && <p>Welcome, {username}!</p>}
      <p>This is the Project Manager Dashboard.</p>
    </div>
  );
};

export default ProjectManagerDashboard;
