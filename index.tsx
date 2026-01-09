
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global error catcher for debugging white screens
window.addEventListener('error', (event) => {
  console.error('Runtime Error:', event.error);
  const root = document.getElementById('root');
  if (root && (root.innerHTML.includes('app-loader') || root.innerHTML === '')) {
    root.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: sans-serif;">
        <h2 style="color: #ef4444;">Oops! Something went wrong</h2>
        <p style="color: #6b7280;">The app failed to load. This is often due to a connection issue or a library loading error.</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer;">
          Try Refreshing
        </button>
        <pre style="margin-top: 20px; text-align: left; background: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 12px; overflow-x: auto;">${event.message}</pre>
      </div>
    `;
  }
});

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Mounting error:", err);
  }
}
