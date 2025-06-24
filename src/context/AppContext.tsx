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
  highlightedPageId: UniqueIdentifier | null;
  setHighlightedPageId: Dispatch<SetStateAction<UniqueIdentifier | null>>;
}

interface AppProviderProps {
  children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: AppProviderProps) {
  const [pages, setPages] = useState<Page[]>([]);
  const [highlightedPageId, setHighlightedPageId] =
    useState<UniqueIdentifier | null>(null);

  const contextValue: AppContextType = {
    pages,
    setPages,
    highlightedPageId,
    setHighlightedPageId,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
