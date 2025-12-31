// =================================================================================================
// 🔓 LOGIN PAGE
// =================================================================================================
// The entry point for Admins.
// It takes Email & Password -> Sends to Backend -> Gets Token -> Redirects to Dashboard.

import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert
} from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    // Local State for input fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Hooks from Context and Router
    const { login } = useAuth();
    const navigate = useNavigate();

    // Handle Login Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true); // Disable button while loading
        try {
            // 1. Call AuthContext login function
            await login(email, password);
            // 2. If successful, redirect to Home ('/')
            navigate('/');
        } catch (err) {
            // 3. If failed, show error message
            setError('Login failed. Please check your credentials.');
            console.error(err);
        } finally {
            setLoading(false); // Re-enable button
        }
    };

    return (
        // Full Screen Centered Layout with Gradient Background
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #e91e63 0%, #9c27b0 100%)'
            }}
        >
            <Card sx={{ maxWidth: 400, width: '100%', m: 2, p: 2 }}>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                        JainConnect
                    </Typography>
                    <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
                        Admin Panel Login
                    </Typography>

                    {/* Show Error Alert if Login Fails */}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mt: 3 }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;
