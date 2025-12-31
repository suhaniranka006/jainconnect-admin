// =================================================================================================
// 🔐 AUTH CONTEXT (The Gatekeeper)
// =================================================================================================
// This file acts as the "Global State" for user login.
// It allows ANY component in the app to ask: "Is the user logged in?" without passing props down manually.

import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../components/api';

// 1. Create the Context (The empty box)
const AuthContext = createContext(null);

// 2. Create the Provider (The logic that fills the box)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);   // Stores user data (null = not logged in)
    const [loading, setLoading] = useState(true); // Is the app still checking credentials?

    useEffect(() => {
        // 🔄 ON APP START: Check if previously logged in
        const token = localStorage.getItem('token');
        if (token) {
            // If we find a token, we assume the user is logged in.
            // In a real app, you might verify this token with the backend here.
            setUser({ token });
        }
        setLoading(false); // Finished loading
    }, []);

    // ✅ LOGIN FUNCTION: Called by Login Page
    const login = async (email, password) => {
        try {
            // Call backend API
            const response = await api.post('/users/login', { email, password });
            const { token, user } = response.data;

            // Save to Local Storage (keeps user logged in after refresh)
            localStorage.setItem('token', token);

            // Update State
            setUser({ ...user, token });
            return user;
        } catch (error) {
            throw error; // Let the Login Page handle the error UI
        }
    };

    // ❌ LOGOUT FUNCTION: Called by Navbar/Sidebar
    const logout = () => {
        localStorage.removeItem('token'); // Delete token
        setUser(null);                    // Clear state
    };

    // 📦 EXPORT VALUES: Make variables available to the rest of the app
    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children} {/* Don't render app until we know auth status */}
        </AuthContext.Provider>
    );
};

// 3. Custom Hook (Easy way to use this context)
// Usage: const { user, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);
