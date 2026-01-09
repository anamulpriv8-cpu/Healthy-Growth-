
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global error handler for catching runtime issues
window.onerror = function(message, source, lineno, colno, error) {
  console.error("Global Error Caught: ", message, error);
  // If it's a white screen issue, we can at least see something in the console
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (err) {
  console.error("Render error:", err);
  rootElement.innerHTML = `<div style="padding: 20px; color: red; font-family: sans-serif;">
    <h2>App Loading Error</h2>
    <p>Please check the console for details. This might be due to an API key issue or network error.</p>
  </div>`;
}
