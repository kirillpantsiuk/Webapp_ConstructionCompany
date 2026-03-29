// frontend/src/services/authService.js
import axios from 'axios';

// Функція для логіну користувача
export const login = async (login, password) => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      login,
      password
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
