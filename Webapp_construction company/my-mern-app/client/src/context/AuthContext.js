import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setIsAuthenticated(true);
            setUserRole(user.role);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, setIsAuthenticated, setUserRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
