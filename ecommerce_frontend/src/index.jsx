import App from './App.jsx';
import './index.css';
import reportWebVitals from './reportWebVitals.js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { CartProvider } from './context/CartContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> {/* React.StrictMode es buena práctica */}
    <BrowserRouter> {/* <-- ENVOLVER CON BrowserRouter */}
      <AuthProvider> {/* <-- ENVOLVER CON AuthProvider */}
        <CartProvider> {/* Tu CartProvider existente */}
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitalsreportWebVitals();
reportWebVitals();
