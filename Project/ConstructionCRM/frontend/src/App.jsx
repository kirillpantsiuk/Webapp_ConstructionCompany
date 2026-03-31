import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminRegisterPage from './pages/AdminRegisterPage'; // Додаємо імпорт

function App() {
  return (
    <Router>
      <Routes>
        {/* Головний маршрут '/' тепер відразу показує форму входу */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Маршрут для входу */}
        <Route path="/login" element={<LoginPage />} />

        {/* НОВИЙ МАРШРУТ: Сторінка реєстрації для адміна */}
        <Route path="/admin/register" element={<AdminRegisterPage />} />

        {/* Тимчасовий маршрут для звичайних користувачів */}
        <Route path="/dashboard" element={
          <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
            <h1>Вітаємо в системі! 👋</h1>
            <p>Ваша панель керування в розробці.</p>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;