import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../components/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token on load
        const token = localStorage.getItem('token');
        if (token) {
            // Decode token or fetch user profile if needed
            // For now, we just assume if token exists, we are logged in
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Call your backend login endpoint
        const response = await api.post('/users/login', { email, password });
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        setUser({ ...user, token });
        return user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
