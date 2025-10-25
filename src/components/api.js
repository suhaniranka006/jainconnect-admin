// src/api.js

import axios from 'axios';

// Yeh function aapka hardcoded token return karega
const getAuthToken = () => {
  // 👇👇👇 YAHAN POSTMAN SE COPY KIYA HUA TOKEN PASTE KAREIN 👇👇👇
  const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGVlMjZiMzlkNWMzOWJiMjdiOWM5YjMiLCJpYXQiOjE3NjEzNjk0OTYsImV4cCI6MTc2MTk3NDI5Nn0.nKLk_t4CnDlIuHgMyomxIMLqGlq5rWNcym4gXtwMXM8";
  
  return TOKEN;
};

// Axios ka ek naya instance banayein
const api = axios.create({
  baseURL: 'https://jainconnect-backened-2.onrender.com/api',
});

// Axios Interceptor ka istemal karein
// Yeh code har request bhejne se pehle chalega
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      // Agar token hai, toh use Authorization header me add kar do
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;