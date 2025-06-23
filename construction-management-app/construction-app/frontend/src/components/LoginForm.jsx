import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container
} from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', formData.email);
      alert('Вхід успішний!');
      navigate('/dashboard');
    } catch (err) {
      alert('Помилка: ' + (err.response?.data?.msg || 'Невідома'));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          p: 4,
          borderRadius: '12px',
          boxShadow: 6,
          color: '#000',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Вхід
        </Typography>
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Пароль"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Увійти
        </Button>
        <Typography sx={{ mt: 2 }}>
          Ще не маєш акаунту? <Link to="/register">Зареєструватись</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginForm;
