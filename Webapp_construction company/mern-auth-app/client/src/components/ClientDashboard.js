import React from 'react';
import '../styles.css';

const ClientDashboard = () => {
  const username = localStorage.getItem('username');

  return (
    <div>
      <h2>Client Dashboard</h2>
      {username && <p>Welcome, {username}!</p>}
      <p>This is the Client Dashboard.</p>
    </div>
  );
};

export default ClientDashboard;
