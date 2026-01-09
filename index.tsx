
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global error catcher for debugging
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Fatal Runtime Error:', error || message);
  const root = document.getElementById('root');
  if (root) {
    const loader = document.getElementById('app-loader');
    if (loader) loader.style.display = 'none';
    
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'padding: 40px; text-align: center; font-family: sans-serif;';
    errorDiv.innerHTML = `
      <h2 style="color: #ef4444; font-weight: 800;">App Launch Failed</h2>
      <p style="color: #6b7280; margin: 10px 0;">This can happen due to a temporary connection issue. Please try refreshing.</p>
      <button onclick="window.location.reload()" style="margin-top: 20px; padding: 12px 24px; background: #10b981; color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer;">
        Reload Application
      </button>
      <div style="margin-top: 30px; text-align: left; background: #f3f4f6; padding: 15px; border-radius: 12px; font-size: 11px; font-family: monospace; overflow-x: auto; color: #374151;">
        ${message}
      </div>
    `;
    root.appendChild(errorDiv);
  }
  return false;
};

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
