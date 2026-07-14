import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign WebSocket and Vite HMR errors in the sandbox environment
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = reason?.message || String(reason);
    if (message.includes('WebSocket') || message.includes('vite') || message.includes('ws://') || message.includes('wss://')) {
      event.preventDefault();
      console.warn('Suppressed benign WebSocket rejection in preview environment:', reason);
    }
  });

  window.addEventListener('error', (event) => {
    const message = event.message || '';
    if (message.includes('WebSocket') || message.includes('vite') || message.includes('ws://') || message.includes('wss://')) {
      event.preventDefault();
      console.warn('Suppressed benign WebSocket error in preview environment:', event.message);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

