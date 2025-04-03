import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // Importa o service worker

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registra o Service Worker para tornar o app um PWA
serviceWorkerRegistration.register();

// Se você quiser medir a performance, pode passar uma função como argumento para `reportWebVitals`
reportWebVitals();
