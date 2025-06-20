import type { UniqueIdentifier } from '@dnd-kit/core';
import {
  createContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

export interface Page {
  id: UniqueIdentifier;
  label: string;
}

interface AppContextType {
  pages: Page[];
  setPages: Dispatch<SetStateAction<Page[]>>;
}

interface AppProviderProps {
  children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: AppProviderProps) {
  const [pages, setPages] = useState<Page[]>([]);
  // Define your context state and functions here
  const contextValue: AppContextType = {
    pages: pages,
    setPages: setPages,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
