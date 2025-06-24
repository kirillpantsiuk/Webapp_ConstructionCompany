import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';

export default function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      {/* Якщо є токен — до дашборду, інакше — реєстрація */}
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? '/dashboard' : '/register'} replace />}
      />

      {/* Форма реєстрації */}
      <Route path="/register" element={<Register />} />

      {/* Форма входу */}
      <Route path="/login" element={<Login />} />

      {/* Захищений дашборд з меню */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
