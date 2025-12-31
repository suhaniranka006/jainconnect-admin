// =================================================================================================
// 🚀 ENTRY POINT
// =================================================================================================
// This is the first file that runs when the website loads.
// It finds the <div id="root"></div> in the HTML and puts our React App inside it.

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';         // Global Styles
import App from './App';      // The Main App Component
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance Measuring (Optional)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
