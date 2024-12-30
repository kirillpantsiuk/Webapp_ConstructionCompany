import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

const register = (username, password, role, name, email, phone, address) => {
  return axios.post(API_URL + 'register', { username, password, role, name, email, phone, address });
};

const login = (username, password) => {
  return axios.post(API_URL + 'login', { username, password });
};

// Присваиваем объект переменной перед экспортом
const AuthService = {
  register,
  login,
};

export default AuthService;
