import React, { useState } from 'react';
import {
  Box, TextField, Button, MenuItem, Typography, Grid, Container
} from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const roles = ['builder', 'foreman', 'project_manager', 'client', 'director', 'accountant'];

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', password: '', email: '', role: '',
    address: { street: '', city: '', state: '', postalCode: '', country: '' }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Реєстрація успішна!');
      navigate('/login');
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
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          p: 4,
          borderRadius: '12px',
          boxShadow: 6,
          color: '#000',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Реєстрація</Typography>
        <TextField label="Username" name="username" onChange={handleChange} required />
        <TextField label="Email" name="email" type="email" onChange={handleChange} required />
        <TextField label="Пароль" name="password" type="password" onChange={handleChange} required />
        <TextField select label="Роль" name="role" onChange={handleChange} required>
          {roles.map((role) => (
            <MenuItem key={role} value={role}>{role}</MenuItem>
          ))}
        </TextField>
        <Typography variant="h6">Адреса</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}><TextField label="Вулиця" name="address.street" fullWidth onChange={handleChange} /></Grid>
          <Grid item xs={6}><TextField label="Місто" name="address.city" fullWidth onChange={handleChange} /></Grid>
          <Grid item xs={6}><TextField label="Область" name="address.state" fullWidth onChange={handleChange} /></Grid>
          <Grid item xs={6}><TextField label="Поштовий індекс" name="address.postalCode" fullWidth onChange={handleChange} /></Grid>
          <Grid item xs={12}><TextField label="Країна" name="address.country" fullWidth onChange={handleChange} /></Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary">Зареєструватись</Button>
        <Typography sx={{ mt: 2 }}>
          Вже маєш акаунт? <Link to="/login">Увійти</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterForm;
