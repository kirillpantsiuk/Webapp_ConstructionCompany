// client/src/components/Dashboard/Layout.js
import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Toolbar, Box } from '@mui/material';

export default function Layout() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar onNavigate={navigate} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
