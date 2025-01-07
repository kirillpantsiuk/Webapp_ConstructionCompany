import React, { useState } from 'react';
import { register } from '../services/authService';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register({ username, email, password, role, address });
      localStorage.setItem('token', res.data.token);
      // Перенаправление или обновление состояния
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role"
        required
      />
      <input
        type="text"
        value={address.street}
        onChange={(e) => setAddress({ ...address, street: e.target.value })}
        placeholder="Street"
        required
      />
      <input
        type="text"
        value={address.city}
        onChange={(e) => setAddress({ ...address, city: e.target.value })}
        placeholder="City"
        required
      />
      <input
        type="text"
        value={address.state}
        onChange={(e) => setAddress({ ...address, state: e.target.value })}
        placeholder="State"
        required
      />
      <input
        type="text"
        value={address.postalCode}
        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
        placeholder="Postal Code"
        required
      />
      <input
        type="text"
        value={address.country}
        onChange={(e) => setAddress({ ...address, country: e.target.value })}
        placeholder="Country"
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
