import React from 'react';
import '../styles.css';

const UserInfo = () => {
  const username = localStorage.getItem('username');

  return (
    <div className="user-info">
      {username ? <p>Welcome, {username}!</p> : <p>Please login to see your username.</p>}
    </div>
  );
};

export default UserInfo;
