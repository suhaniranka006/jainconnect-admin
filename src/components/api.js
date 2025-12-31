// =================================================================================================
// 🌐 API CONFIGURATION
// =================================================================================================
// This file sets up the connection to our Backend.
// Instead of using 'fetch' everywhere, we use 'axios' for better features.

import axios from 'axios';

// 1. Create a Central API Instance
const api = axios.create({
  // The base URL for all requests
  baseURL: 'https://jainconnect-backened-2.onrender.com/api',
  // Fail if request takes longer than 2 minutes
  timeout: 120000,
});

// 2. Request Interceptor (The Security Guard)
// Before any request is sent, this code runs.
api.interceptors.request.use(
  (config) => {
    // Check if we have a token (from login)
    const token = localStorage.getItem('token');
    if (token) {
      // If yes, attach it to the request header
      // This tells the backend: "It's me, I'm logged in!"
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;