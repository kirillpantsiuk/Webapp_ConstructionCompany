// client/src/components/Dashboard/Sidebar.js
import React from 'react';
import { Drawer, List, ListItemButton, ListItemText, Toolbar, Box } from '@mui/material';

const menuItems = [
  { label: 'Головна', path: '/dashboard' },
  { label: 'Проекти', path: '/projects' },
  { label: 'Задачі', path: '/tasks' }
];

export default function Sidebar({ onNavigate }) {
  return (
    <Drawer variant="permanent" sx={{
      width: 240,
      [`& .MuiDrawer-paper`]: {
        width: 240,
        boxSizing: 'border-box',
        background: 'linear-gradient(180deg, #161D44 0%, #3331AC 100%)',
        color: '#fff'
      }
    }}>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map(item => (
            <ListItemButton key={item.path} onClick={() => onNavigate(item.path)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
