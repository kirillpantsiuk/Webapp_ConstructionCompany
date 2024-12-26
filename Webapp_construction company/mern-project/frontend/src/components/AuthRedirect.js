// src/components/AuthRedirect.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Decoded token:', decodedToken);
        const role = decodedToken.role;
        if (role === 'Foreman') {
          navigate('/foreman-dashboard');
        } else if (role === 'Builder') {
          navigate('/builder-dashboard');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return null;
};

export default AuthRedirect;
