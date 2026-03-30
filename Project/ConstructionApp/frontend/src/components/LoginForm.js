import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/superadmin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // ✅ повідомлення про успішну авторизацію
      } else {
        alert(data.message); // ❌ повідомлення про помилку
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('❌ Server error');
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back 👋</h2>
      <p>
        Today is a new day. It's your day. You shape it.<br />
        Sign in to start managing your projects.
      </p>

      <form onSubmit={handleSubmit} className="login-form">
        <label>Email</label>
        <input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="forgot-password">
          <a href="/forgot-password">Forgot Password?</a>
        </div>

        <button type="submit" className="login-button">Sign in</button>
      </form>
    </div>
  );
};

export default LoginForm;
