import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import AdminRegisterPage from './pages/AdminRegisterPage.jsx';
import ManagerDashboard from './pages/ManagerDashboard.jsx';

// Тимчасовий компонент для технічного координатора (поки не створено окремий файл)
const TechnicalDashboard = () => (
  <div style={{ color: 'white', textAlign: 'center', marginTop: '100px', fontFamily: 'Inter, sans-serif' }}>
    <h1 style={{ fontSize: '32px' }}>Панель Технічного Координатора 🛠️</h1>
    <p style={{ color: '#94a3b8' }}>Планування етапів та моніторинг ресурсів.</p>
    <button 
      onClick={() => { localStorage.removeItem('userInfo'); window.location.href = '/login'; }}
      style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', borderRadius: '8px', border: 'none', background: '#38bdf8' }}
    >
      Вийти
    </button>
  </div>
);

// --- ГОЛОВНИЙ КОМПОНЕНТ APP ---

function App() {
  return (
    <Router>
      <Routes>
        {/* Головна сторінка перенаправляє на логін */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Маршрут для входу */}
        <Route path="/login" element={<LoginPage />} />

        {/* Сторінка керування персоналом (тільки для SuperAdmin) */}
        <Route path="/admin/register" element={<AdminRegisterPage />} />

        {/* Тепер тут використовується імпортований ManagerDashboard з вашим дизайном */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />

        {/* Дашборд для Технічних Координаторів */}
        <Route path="/technical/dashboard" element={<TechnicalDashboard />} />

        {/* Універсальний маршрут для помилок або невідомих шляхів */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;