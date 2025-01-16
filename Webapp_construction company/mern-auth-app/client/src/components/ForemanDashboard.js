import React from 'react';
import '../styles.css';

const ForemanDashboard = () => {
  const username = localStorage.getItem('username');

  return (
    <div>
      <h2>Foreman Dashboard</h2>
      {username && <p>Welcome, {username}!</p>}
      <p>This is the Foreman Dashboard.</p>
    </div>
  );
};

export default ForemanDashboard;
