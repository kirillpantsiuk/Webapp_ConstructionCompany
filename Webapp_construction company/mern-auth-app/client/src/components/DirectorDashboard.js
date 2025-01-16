import React from 'react';
import '../styles.css';

const DirectorDashboard = () => {
  const username = localStorage.getItem('username');

  return (
    <div>
      <h2>Director Dashboard</h2>
      {username && <p>Welcome, {username}!</p>}
      <p>This is the Director Dashboard.</p>
    </div>
  );
};

export default DirectorDashboard;
