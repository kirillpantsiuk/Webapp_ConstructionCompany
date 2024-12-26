// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForemanDashboard from './components/ForemanDashboard';
import BuilderDashboard from './components/BuilderDashboard';
import Users from './components/Users';
import Teams from './components/Teams';
import WorkSchedules from './components/WorkSchedules';
import AuthRedirect from './components/AuthRedirect';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth-redirect" element={<AuthRedirect />} />
        <Route path="/foreman-dashboard" element={<ForemanDashboard />} />
        <Route path="/builder-dashboard" element={<BuilderDashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/work-schedules" element={<WorkSchedules />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
