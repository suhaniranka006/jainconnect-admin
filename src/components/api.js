// src/api.js
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'https://jainconnect-backened-2.onrender.com/api',
  timeout: 120000, // 2 minutes timeout
});

// Axios Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;