import React from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  AppBar,
  CssBaseline
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ← Виправлений імпорт

const drawerWidth = 220;

const getRoleComponent = role => {
  switch (role) {
    case 'client':
      return <Typography variant="h4">📋 Дашборд Клієнта</Typography>;
    case 'builder':
      return <Typography variant="h4">🛠️ Дашборд Будівельника</Typography>;
    case 'foreman':
      return <Typography variant="h4">📅 Дашборд Бригадира</Typography>;
    case 'project_manager':
      return <Typography variant="h4">📈 Дашборд Менеджера Проєкту</Typography>;
    case 'accountant':
      return <Typography variant="h4">💰 Дашборд Бухгалтера</Typography>;
    case 'director':
      return <Typography variant="h4">🎯 Дашборд Директора</Typography>;
    default:
      return <Typography variant="h4">🔐 Невідома роль</Typography>;
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = token ? jwtDecode(token)?.user?.role : null;

  const menu = [
    { label: 'Дашборд', path: '/dashboard' },
    { label: 'Профіль', path: '/profile' },
    {
      label: 'Вийти',
      action: () => {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: theme => theme.zIndex.drawer + 1,
          background: 'linear-gradient(to right, #161D44, #3331AC)'
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {role?.toUpperCase()} Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(to bottom, #161D44, #3331AC)',
            color: '#fff'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menu.map((item, index) => (
              <ListItemButton
                key={index}
                onClick={() => item.path ? navigate(item.path) : item.action()}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: 8,
          bgcolor: '#f5f7fa'
        }}
      >
        {getRoleComponent(role)}
        <Typography variant="body1" sx={{ mt: 2 }}>
          Вітаємо! Тут буде індивідуальний функціонал відповідно до вашої ролі.
        </Typography>
      </Box>
    </Box>
  );
}
