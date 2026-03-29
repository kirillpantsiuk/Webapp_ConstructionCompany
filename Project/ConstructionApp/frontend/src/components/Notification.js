import React from 'react';

const Notification = ({ type, message }) => {
  const styles = {
    base: {
      padding: '12px',
      margin: '10px 0',
      borderRadius: '5px',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    success: { backgroundColor: '#d4edda', color: '#155724' },
    error: { backgroundColor: '#f8d7da', color: '#721c24' },
    info: { backgroundColor: '#d1ecf1', color: '#0c5460' },
    warning: { backgroundColor: '#fff3cd', color: '#856404' },
    note: { backgroundColor: '#e2e3e5', color: '#383d41' }
  };

  return (
    <div style={{ ...styles.base, ...styles[type] }}>
      {message}
    </div>
  );
};

export default Notification;
