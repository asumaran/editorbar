import type { UniqueIdentifier } from '@dnd-kit/core';
import { createContext, useReducer, type ReactNode } from 'react';

export interface Page {
  id: UniqueIdentifier;
  label: string;
}

// Action types for the reducer
export type AppAction =
  | { type: 'SET_PAGES'; payload: Page[] }
  | { type: 'ADD_PAGE'; payload: { label: string; at?: number } }
  | { type: 'ADD_PAGE_AT_END'; payload: { label: string } }
  | { type: 'DELETE_PAGE'; payload: { id: UniqueIdentifier } }
  | {
      type: 'REORDER_PAGES';
      payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier };
    }
  | { type: 'SET_HIGHLIGHTED_PAGE'; payload: { id: UniqueIdentifier | null } };

interface AppState {
  pages: Page[];
  highlightedPageId: UniqueIdentifier | null;
}

interface AppContextType {
  pages: Page[];
  highlightedPageId: UniqueIdentifier | null;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions for common actions
  addPage: (label: string, at?: number) => void;
  addPageAtEnd: (label: string) => void;
  deletePage: (id: UniqueIdentifier) => void;
  reorderPages: (activeId: UniqueIdentifier, overId: UniqueIdentifier) => void;
  setHighlightedPageId: (id: UniqueIdentifier | null) => void;
}

interface AppProviderProps {
  children: ReactNode;
}

// Helper function to generate unique IDs
function generatePageId(): string {
  return `page-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

// Reducer function to manage app state
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PAGES':
      return {
        ...state,
        pages: action.payload,
      };

    case 'ADD_PAGE': {
      const { label, at } = action.payload;
      const newPage: Page = {
        id: generatePageId(),
        label,
      };

      // If 'at' is specified, insert at that position, otherwise add at the end
      const newPages =
        at !== undefined
          ? [
              ...state.pages.slice(0, at + 1),
              newPage,
              ...state.pages.slice(at + 1),
            ]
          : [...state.pages, newPage];

      return {
        ...state,
        pages: newPages,
        highlightedPageId: newPage.id, // Highlight the newly added page
      };
    }

    case 'ADD_PAGE_AT_END': {
      const newPage: Page = {
        id: generatePageId(),
        label: action.payload.label,
      };

      return {
        ...state,
        pages: [...state.pages, newPage],
        highlightedPageId: newPage.id,
      };
    }

    case 'DELETE_PAGE':
      return {
        ...state,
        pages: state.pages.filter((page) => page.id !== action.payload.id),
        // Clear highlight if the deleted page was highlighted
        highlightedPageId:
          state.highlightedPageId === action.payload.id
            ? null
            : state.highlightedPageId,
      };

    case 'REORDER_PAGES': {
      const { activeId, overId } = action.payload;
      const oldIndex = state.pages.findIndex((p) => p.id === activeId);
      const newIndex = state.pages.findIndex((p) => p.id === overId);

      if (oldIndex === -1 || newIndex === -1) return state;

      // Use arrayMove logic inline to avoid external dependency in reducer
      const newPages = [...state.pages];
      const [movedItem] = newPages.splice(oldIndex, 1);
      newPages.splice(newIndex, 0, movedItem);

      return {
        ...state,
        pages: newPages,
      };
    }

    case 'SET_HIGHLIGHTED_PAGE':
      return {
        ...state,
        highlightedPageId: action.payload.id,
      };

    default:
      return state;
  }
}

// Initial state
const initialState: AppState = {
  pages: [],
  highlightedPageId: null,
};

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper functions for easier usage
  const addPage = (label: string, at?: number) => {
    dispatch({ type: 'ADD_PAGE', payload: { label, at } });
  };

  const addPageAtEnd = (label: string) => {
    dispatch({ type: 'ADD_PAGE_AT_END', payload: { label } });
  };

  const deletePage = (id: UniqueIdentifier) => {
    dispatch({ type: 'DELETE_PAGE', payload: { id } });
  };

  const reorderPages = (
    activeId: UniqueIdentifier,
    overId: UniqueIdentifier
  ) => {
    dispatch({ type: 'REORDER_PAGES', payload: { activeId, overId } });
  };

  const setHighlightedPageId = (id: UniqueIdentifier | null) => {
    dispatch({ type: 'SET_HIGHLIGHTED_PAGE', payload: { id } });
  };

  const contextValue: AppContextType = {
    pages: state.pages,
    highlightedPageId: state.highlightedPageId,
    dispatch,
    addPage,
    addPageAtEnd,
    deletePage,
    reorderPages,
    setHighlightedPageId,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
