import React from 'react';
import AuthForm from '../components/AuthForm';
import { Container } from '@mui/material';

const LoginPage: React.FC = () => {
  return (
    <Container>
      <AuthForm type="login" />
    </Container>
  );
};

export default LoginPage;