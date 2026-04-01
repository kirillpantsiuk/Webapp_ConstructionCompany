import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import AdminRegisterPage from './pages/AdminRegisterPage.jsx';
import ManagerDashboard from './pages/ManagerDashboard.jsx';
import TechnicalDashboard from './pages/TechnicalDashboard.jsx';

// --- ГОЛОВНИЙ КОМПОНЕНТ APP ---

function App() {
  return (
    <Router>
      <Routes>
        {/* Головна сторінка перенаправляє на логін за замовчуванням */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Маршрут для сторінки входу */}
        <Route path="/login" element={<LoginPage />} />

        {/* Сторінка керування персоналом (доступна для SuperAdmin) */}
        <Route path="/admin/register" element={<AdminRegisterPage />} />

        {/* Дашборд для Менеджерів (Manager) */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />

        {/* Дашборд для Технічних Координаторів (TechnicalCoordinator) */}
        <Route path="/technical/dashboard" element={<TechnicalDashboard />} />

        {/* Універсальний маршрут: якщо шлях не знайдено, повертаємо на логін */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;