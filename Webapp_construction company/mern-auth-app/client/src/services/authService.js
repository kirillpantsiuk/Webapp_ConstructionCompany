import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

const register = (userData) => {
  return axios.post(API_URL + 'register', userData);
};

const login = (userData) => {
  return axios.post(API_URL + 'login', userData);
};

const verifyToken = (token) => {
  return axios.post(API_URL + 'verify', null, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const authService = {
  register,
  login,
  verifyToken,
};

export default authService;
