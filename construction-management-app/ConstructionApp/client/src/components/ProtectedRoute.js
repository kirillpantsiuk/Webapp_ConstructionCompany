// client/src/components/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  // Если нет токена — редирект на страницу входа
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Иначе рендерим "защищённый" компонент
  return children;
}
