import React from 'react';

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Dashboard</h2>
      <p>Welcome to the dashboard!</p>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#1B1D1E',
    color: '#C13B00',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
};

export default Dashboard;
