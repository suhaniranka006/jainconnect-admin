// =================================================================================================
// 📱 MAIN APP COMPONENT
// =================================================================================================
// Only Purpose: Routing & Configuration
// 1. Sets up the "Theme" (Colors, Fonts).
// 2. Sets up "AuthContext" (Who is logged in?).
// 3. Defines "Routes" (Which URL goes to which Page?).

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './auth/AuthContext';
import theme from './theme/theme';

// Import All Pages
import Login from './pages/Login';
import MaharajPage from './pages/MaharajPage';
import EventsPage from './pages/EventsPage';
import TithiPage from './pages/TithiPage';
import BhojanshalaPage from './pages/BhojanshalaPage';
import TemplePage from './pages/TemplePage';
import CarpoolPage from './pages/CarpoolPage';
import StoriesPage from './pages/StoriesPage';
import TirthyatraTemplatesPage from './pages/TirthyatraTemplatesPage';

// Security Component (Redirection logic)
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    // 🎨 ThemeProvider: Makes sure all buttons/text use our custom colors
    <ThemeProvider theme={theme}>

      {/* 🔐 AuthProvider: Lets any component check "Is user logged in?" */}
      <AuthProvider>

        {/* 🗺️ BrowserRouter: Listens to the URL bar */}
        <BrowserRouter>
          <Routes>

            {/* PUBLIC ROUTE: Anyone can see Login */}
            <Route path="/login" element={<Login />} />

            {/* ROOT ROUTE: Redirects to /maharajs if logged in, else to Login */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Navigate to="/maharajs" replace />
                </PrivateRoute>
              }
            />

            {/* 🔒 PROTECTED ROUTES (Must be logged in) */}

            {/* Maharaj (Monks) Management */}
            <Route
              path="/maharajs"
              element={
                <PrivateRoute>
                  <MaharajPage />
                </PrivateRoute>
              }
            />

            {/* Events Management */}
            <Route
              path="/events"
              element={
                <PrivateRoute>
                  <EventsPage />
                </PrivateRoute>
              }
            />

            {/* Tithi (Calendar) Management */}
            <Route
              path="/tithis"
              element={
                <PrivateRoute>
                  <TithiPage />
                </PrivateRoute>
              }
            />

            {/* Bhojanshala (Dining) Management */}
            <Route
              path="/bhojanshalas"
              element={
                <PrivateRoute>
                  <BhojanshalaPage />
                </PrivateRoute>
              }
            />

            {/* Temple Management */}
            <Route
              path="/temples"
              element={
                <PrivateRoute>
                  <TemplePage />
                </PrivateRoute>
              }
            />

            {/* Carpool (Ride Share) Management */}
            <Route
              path="/carpools"
              element={
                <PrivateRoute>
                  <CarpoolPage />
                </PrivateRoute>
              }
            />

            {/* Stories (Blog) Management */}
            <Route
              path="/stories"
              element={
                <PrivateRoute>
                  <StoriesPage />
                </PrivateRoute>
              }
            />

            {/* Trip Templates Management */}
            <Route
              path="/tirthyatra-templates"
              element={
                <PrivateRoute>
                  <TirthyatraTemplatesPage />
                </PrivateRoute>
              }
            />

            {/* FALLBACK: Any unknown URL -> Go Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
