import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, TextField, MenuItem,
  FormControl, InputLabel, Select, Typography, Grid, Paper
} from '@mui/material';
import api from '../utils/api';

const roles = [
  'builder','foreman','project_manager','client','director','accountant'
];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username:'', email:'', password:'', role:'client',
    street:'', city:'', state:'', postalCode:'', country:''
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country
        }
      });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Помилка реєстрації');
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #161D44 0%, #3331AC 35%, #5572D8 100%)',
        p: 2
      }}
    >
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            p: 4,
            backgroundColor: '#ffffffee',
            backdropFilter: 'blur(4px)'
          }}
        >
          <Typography variant="h5" align="center" mb={3} sx={{ fontWeight: 600 }}>
            Реєстрація користувача
          </Typography>

          {error && <Typography color="error">{error}</Typography>}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth required label="Username" name="username" value={form.username} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth required type="email" label="Email" name="email" value={form.email} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth required type="password" label="Password" name="password" value={form.password} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select name="role" label="Role" value={form.role} onChange={handleChange}>
                    {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}><Typography variant="subtitle1">Адреса</Typography></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Вулиця" name="street" value={form.street} onChange={handleChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth label="Місто" name="city" value={form.city} onChange={handleChange} /></Grid>
              <Grid item xs={12} sm={4}><TextField fullWidth label="Область" name="state" value={form.state} onChange={handleChange} /></Grid>
              <Grid item xs={12} sm={4}><TextField fullWidth label="Індекс" name="postalCode" value={form.postalCode} onChange={handleChange} /></Grid>
              <Grid item xs={12} sm={4}><TextField fullWidth label="Країна" name="country" value={form.country} onChange={handleChange} /></Grid>

              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained" size="large">Зареєструватись</Button>
              </Grid>
              <Grid item xs={12}>
                <Typography align="center">Вже є акаунт? <Link to="/login">Увійти</Link></Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
