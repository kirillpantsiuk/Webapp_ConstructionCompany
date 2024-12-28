import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import BuilderDashboard from './components/BuilderDashboard';
import ForemanDashboard from './components/ForemanDashboard';
import ProjectManagerDashboard from './components/ProjectManagerDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import DirectorDashboard from './components/DirectorDashboard';
import AuthContext from './context/AuthContext';
import './styles/AuthForm.css'; // Импортируем стили

const App = () => {
    const { isAuthenticated, userRole } = useContext(AuthContext);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.classList.toggle('dark-theme', savedTheme === 'dark');
        }
    }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={
                        isAuthenticated ? (
                            userRole === 'Builder' ? <BuilderDashboard /> :
                            userRole === 'Foreman' ? <ForemanDashboard /> :
                            userRole === 'ProjectManager' ? <ProjectManagerDashboard /> :
                            userRole === 'Customer' ? <CustomerDashboard /> :
                            userRole === 'Director' ? <DirectorDashboard /> :
                            <Navigate to="/login" />
                        ) : (
                            <Navigate to="/login" />
                        )
                    } />
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/register"} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
