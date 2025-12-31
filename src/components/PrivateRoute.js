// =================================================================================================
// 🛡️ PRIVATE ROUTE COMPONENT
// =================================================================================================
// Usage: <PrivateRoute> <DashboardPage /> </PrivateRoute>
// Logic:
// 1. If currently checking auth status (loading) -> Show Spinner.
// 2. If User is Logged In -> Show the Page (children).
// 3. If User is NOT Logged In -> Redirect to Login Page.

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // 1. Loading State
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    // 2. Auth Check
    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
