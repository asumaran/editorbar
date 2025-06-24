import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AppProvider } from './context/AppContext.tsx';

/**
 * Application entry point
 *
 * Sets up the React application with:
 * - StrictMode for development warnings and checks
 * - AppProvider for centralized state management
 * - Root App component
 *
 * The AppProvider wraps the entire application to provide
 * page management state and actions to all components.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);
