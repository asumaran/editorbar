import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

/**
 * Custom hook to access the application context
 *
 * This hook provides access to the page management state and actions.
 * Must be used within an AppProvider component tree.
 *
 * @throws {Error} When used outside of AppProvider
 * @returns {AppContextType} The application context containing state and actions
 */
export default function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
