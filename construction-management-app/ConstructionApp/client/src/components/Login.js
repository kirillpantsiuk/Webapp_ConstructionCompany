import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Grid, Paper
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Помилка входу');
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
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: '#ffffffee',
            backdropFilter: 'blur(4px)'
          }}
        >
          <Typography variant="h5" align="center" mb={2} sx={{ fontWeight: 600 }}>
            Вхід в систему
          </Typography>

          {error && <Typography color="error">{error}</Typography>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Email" type="email" fullWidth required value={email} onChange={e => setEmail(e.target.value)} />
            <TextField label="Пароль" type="password" fullWidth required value={password} onChange={e => setPassword(e.target.value)} />
            <Button type="submit" variant="contained" size="large">Увійти</Button>
          </Box>

          <Typography align="center" sx={{ mt: 2 }}>
            Ще не зареєстровані? <Link to="/register">Реєстрація</Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
