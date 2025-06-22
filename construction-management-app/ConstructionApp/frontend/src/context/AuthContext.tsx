import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  userId: string;
  role: string;
  username: string; // Добавлено свойство username
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username'); // Получаем username
    
    if (token && role && username) {
      setUser({ 
        userId: token.split('.')[0], 
        role,
        username // Добавляем username в объект пользователя
      });
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await axios.post('/api/auth/login', { username, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', response.data.role);
    localStorage.setItem('username', username); // Сохраняем username
    setUser({ 
      userId: response.data.token.split('.')[0], 
      role: response.data.role,
      username // Добавляем username
    });
  };

  const register = async (userData: any) => {
    const response = await axios.post('/api/auth/register', userData);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('username', userData.username); // Сохраняем username
    setUser({ 
      userId: response.data.token.split('.')[0], 
      role: userData.role,
      username: userData.username // Добавляем username
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username'); // Удаляем username
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};