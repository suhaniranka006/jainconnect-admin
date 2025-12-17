import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './auth/AuthContext';
import theme from './theme/theme';

import Login from './pages/Login';
import MaharajPage from './pages/MaharajPage';
import EventsPage from './pages/EventsPage';
import TithiPage from './pages/TithiPage';
import BhojanshalaPage from './pages/BhojanshalaPage';
import TemplePage from './pages/TemplePage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Navigate to="/maharajs" replace />
                </PrivateRoute>
              }
            />

            <Route
              path="/maharajs"
              element={
                <PrivateRoute>
                  <MaharajPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/events"
              element={
                <PrivateRoute>
                  <EventsPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/tithis"
              element={
                <PrivateRoute>
                  <TithiPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/bhojanshalas"
              element={
                <PrivateRoute>
                  <BhojanshalaPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/temples"
              element={
                <PrivateRoute>
                  <TemplePage />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
