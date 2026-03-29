import React, { useState } from 'react';
import axios from 'axios';
import Notification from '../components/Notification'; // імпорт нашого компонента

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        login,
        password
      });
      setNotification({
        type: 'success',
        message: `Welcome ${res.data.user.role}: ${res.data.user.login}`
      });
      console.log("Login successful:", res.data);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Invalid login or password'
      });
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Welcome Back 👋</h2>
      <p style={styles.subtitle}>
        Today is a new day. It’s your day. You shape it.<br/>
        Sign in to start managing your projects.
      </p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Login</label>
        <input 
          type="text" 
          placeholder="superadmin" 
          value={login} 
          onChange={(e) => setLogin(e.target.value)} 
          style={styles.input}
        />

        <label style={styles.label}>Password</label>
        <input 
          type="password" 
          placeholder="At least 8 characters" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Sign in</button>
        <p style={styles.forgot}>Forgot Password?</p>
      </form>

      {/* Виводимо сповіщення */}
      {notification && (
        <Notification type={notification.type} message={notification.message} />
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '30px',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },
  title: { marginBottom: '10px' },
  subtitle: { marginBottom: '20px', color: '#555', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  label: { textAlign: 'left', fontSize: '14px', color: '#333' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
  button: {
    padding: '12px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  forgot: { marginTop: '10px', fontSize: '14px', color: '#555', cursor: 'pointer' }
};

export default Login;
