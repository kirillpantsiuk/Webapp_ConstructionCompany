import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3331AC' },
    secondary: { main: '#5572D8' },
    success: { main: '#31AC53' },
    background: {
      default: '#161D44',
      paper: 'rgba(255, 255, 255, 0.08)'
    },
    text: {
      primary: '#ffffff',
      secondary: '#cfd3ec'
    }
  },
  typography: {
    fontFamily: 'Segoe UI, sans-serif',
    fontWeightBold: 700
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          fontWeight: 600,
          textTransform: 'none',
          background: 'linear-gradient(to right, #5572D8, #3331AC)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(to right, #3331AC, #161D44)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            color: '#000' // чорний текст користувача у полях
          },
          '& .MuiSelect-select': {
            color: '#000' // чорний текст у випадаючому списку
          },
          '& .MuiInputLabel-root': {
            color: '#cfd3ec'
          },
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255,255,255,0.9)',
            '& fieldset': {
              borderColor: '#5572D8'
            },
            '&:hover fieldset': {
              borderColor: '#31AC53'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#31AC53'
            }
          }
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#000', // чорний текст у пунктах списку
          backgroundColor: '#fff',
          '&:hover': {
            backgroundColor: '#eef2ff'
          }
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/register" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
