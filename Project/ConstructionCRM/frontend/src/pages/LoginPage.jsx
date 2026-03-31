import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #0a0f16;
  }
  * {
    box-sizing: border-box;
  }
`;

const FullScreenWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0a0f16;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: center center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const GlassFormCard = styled.div`
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 60px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  color: #ffffff;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 32px;
  margin: 0 0 10px 0;
  color: #f8fafc;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #94a3b8;
  margin-bottom: 40px;
  line-height: 1.5;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  text-align: left;
`;

const Label = styled.label`
  font-size: 14px;
  color: #cbd5e1;
  margin-bottom: 8px;
`;

const InputField = styled.input`
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 16px;
  width: 100%;
  &:focus {
    outline: none;
    border-color: #38bdf8;
    box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
  }
`;

const SignInButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(2, 132, 199, 0.3);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notify, setNotify] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleCloseNotify = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotify({ ...notify, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      
      const welcomeMsg = response.data.role === 'SuperAdmin' 
        ? 'Вітаємо, Адмін! Перехід до панелі керування.' 
        : `Вітаємо, ${response.data.login}!`;

      setNotify({ open: true, message: welcomeMsg, severity: 'success' });

      setTimeout(() => {
        if (response.data.role === 'SuperAdmin') {
          navigate('/admin/register');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (error) {
      setNotify({ 
        open: true, 
        message: error.response?.data?.message || 'Невірний email або пароль', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <FullScreenWrapper>
        <GlassFormCard>
          <Title>Вхід у систему 👋</Title>
          <Subtitle>ConstructionCRM. Керуйте етапами будівництва в один клік.</Subtitle>
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>Email</Label>
              <InputField 
                type="email" 
                placeholder="manager@build.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
            <InputGroup>
              <Label>Пароль</Label>
              <InputField 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputGroup>
            <SignInButton type="submit" disabled={loading}>
              {loading ? 'Обробка...' : 'Авторизуватися'}
            </SignInButton>
          </form>
        </GlassFormCard>
      </FullScreenWrapper>
      <Snackbar 
        open={notify.open} 
        autoHideDuration={3000} 
        onClose={handleCloseNotify}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotify} 
          severity={notify.severity} 
          variant="filled" 
          sx={{ width: '100%', borderRadius: '12px', fontWeight: '500' }}
        >
          {notify.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginPage;