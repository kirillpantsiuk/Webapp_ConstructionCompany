import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import BuilderDashboard from './components/BuilderDashboard';
import ForemanDashboard from './components/ForemanDashboard';
import ProjectManagerDashboard from './components/ProjectManagerDashboard';
import ClientDashboard from './components/ClientDashboard';
import DirectorDashboard from './components/DirectorDashboard';
import authService from './services/authService';
import './styles.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await authService.verifyToken(token);
          if (res.data.isValid) {
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/builder-dashboard" element={isAuthenticated ? <BuilderDashboard /> : <Navigate to="/login" />} />
          <Route path="/foreman-dashboard" element={isAuthenticated ? <ForemanDashboard /> : <Navigate to="/login" />} />
          <Route path="/project-manager-dashboard" element={isAuthenticated ? <ProjectManagerDashboard /> : <Navigate to="/login" />} />
          <Route path="/client-dashboard" element={isAuthenticated ? <ClientDashboard /> : <Navigate to="/login" />} />
          <Route path="/director-dashboard" element={isAuthenticated ? <DirectorDashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={isAuthenticated ? <Navigate to="/builder-dashboard" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
