// src/App.js
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import * as actions from './store/actions/auth';
import Register from './components/Register';
import Login from './components/Login';
import BuilderDashboard from './components/BuilderDashboard';
import ForemanDashboard from './components/ForemanDashboard';
import ProjectManagerDashboard from './components/ProjectManagerDashboard';
import ClientDashboard from './components/ClientDashboard';
import DirectorDashboard from './components/DirectorDashboard';
import UserInfo from './components/UserInfo';
import RouteTracker from './components/RouteTracker'; // Импортируем новый компонент
import './styles.css';

const App = ({ isAuthenticated, onTryAutoSignup }) => {
  useEffect(() => {
    onTryAutoSignup();
  }, [onTryAutoSignup]);

  const lastPath = localStorage.getItem('lastPath');

  return (
    <div>
      <Router>
        <RouteTracker /> {/* Добавляем новый компонент */}
        <UserInfo />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsAuthenticated={onTryAutoSignup} />} />
          <Route path="/builder-dashboard" element={isAuthenticated ? <BuilderDashboard /> : <Navigate to={lastPath || '/login'} />} />
          <Route path="/foreman-dashboard" element={isAuthenticated ? <ForemanDashboard /> : <Navigate to={lastPath || '/login'} />} />
          <Route path="/project-manager-dashboard" element={isAuthenticated ? <ProjectManagerDashboard /> : <Navigate to={lastPath || '/login'} />} />
          <Route path="/client-dashboard" element={isAuthenticated ? <ClientDashboard /> : <Navigate to={lastPath || '/login'} />} />
          <Route path="/director-dashboard" element={isAuthenticated ? <DirectorDashboard /> : <Navigate to={lastPath || '/login'} />} />
          <Route path="*" element={isAuthenticated ? <Navigate to={lastPath || '/builder-dashboard'} /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
