import React from 'react';
import '../styles.css';

const BuilderDashboard = () => {
  const username = localStorage.getItem('username');

  return (
    <div>
      <h2>Builder Dashboard</h2>
      {username && <p>Welcome, {username}!</p>}
      <p>This is the Builder Dashboard.</p>
    </div>
  );
};

export default BuilderDashboard;
