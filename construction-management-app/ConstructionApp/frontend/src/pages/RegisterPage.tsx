import React from 'react';
import AuthForm from '../components/AuthForm';
import { Container } from '@mui/material';

const RegisterPage: React.FC = () => {
  return (
    <Container>
      <AuthForm type="register" />
    </Container>
  );
};

export default RegisterPage;