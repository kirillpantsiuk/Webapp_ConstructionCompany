import React from 'react';
import {
  Container,
  Typography,
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Avatar
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const Dashboard = () => {
  const email = localStorage.getItem('userEmail') || 'невідомий';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#161D44',
        color: '#ffffff'
      }}
    >
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(to right, #5572D8, #3331AC)',
          boxShadow: 'none'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Панель керування
          </Typography>
          <IconButton onClick={handleLogout} color="inherit">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Box
          sx={{
            p: 4,
            borderRadius: '16px',
            bgcolor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)',
            textAlign: 'center',
            boxShadow: 6,
            color: '#fff'
          }}
        >
          <Avatar
            sx={{
              bgcolor: '#31AC53',
              color: '#000',
              mx: 'auto',
              width: 64,
              height: 64,
              mb: 2,
              fontSize: 28,
              fontWeight: 'bold'
            }}
          >
            {email[0]?.toUpperCase()}
          </Avatar>

          <Typography variant="h4" fontWeight={700} gutterBottom>
            Вітаємо 👋
          </Typography>
          <Typography variant="h6" sx={{ color: '#cfd3ec' }}>
            Ви ввійшли як: <strong>{email}</strong>
          </Typography>
          <Typography sx={{ mt: 2, color: '#d0d4f6' }}>
            Тут з’являться ваші проєкти, команди, звіти та фінанси.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
