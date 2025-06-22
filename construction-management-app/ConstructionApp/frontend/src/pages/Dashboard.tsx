import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ 
        fontWeight: 700, 
        background: '-webkit-linear-gradient(45deg, #1976d2, #2196f3)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center',
        mb: 4
      }}>
        Construction Management Dashboard
      </Typography>
      
      <Typography variant="h5" component="h2" gutterBottom>
        Welcome, {user?.username}!
      </Typography>
      
      <Typography variant="body1" paragraph>
        Your role: <strong>{user?.role}</strong>
      </Typography>
      
      <Typography variant="body1" paragraph>
        This is your main dashboard. Here you'll be able to manage construction projects, 
        track tasks, monitor materials, and coordinate teams.
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        Please use the navigation menu to access different sections of the application.
      </Typography>
      
      <Button 
        variant="outlined" 
        color="error"
        onClick={logout}
        sx={{ mt: 2 }}
      >
        Logout
      </Button>
    </Container>
  );
};

export default Dashboard;