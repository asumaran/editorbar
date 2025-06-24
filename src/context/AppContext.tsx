import type { UniqueIdentifier } from '@dnd-kit/core';
import { createContext, useReducer, type ReactNode } from 'react';

/**
 * Represents a page in the application with a unique identifier and label
 */
export interface Page {
  id: UniqueIdentifier;
  label: string;
}

/**
 * All possible actions that can be dispatched to modify the application state
 *
 * @typedef {Object} AppAction
 * @property {'SET_PAGES'} type - Replaces all pages with new array
 * @property {'ADD_PAGE'} type - Adds a page at a specific position or at the end
 * @property {'ADD_PAGE_AT_END'} type - Adds a page at the end of the list
 * @property {'DELETE_PAGE'} type - Removes a page by its ID
 * @property {'REORDER_PAGES'} type - Reorders pages based on drag and drop operation
 * @property {'SET_HIGHLIGHTED_PAGE'} type - Sets which page should be highlighted
 */
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

/**
 * The internal state structure of the application
 */
interface AppState {
  pages: Page[];
  highlightedPageId: UniqueIdentifier | null;
}

/**
 * Context type that provides state and actions to consuming components
 * Includes both raw dispatch function and convenient helper methods
 */
interface AppContextType {
  pages: Page[];
  highlightedPageId: UniqueIdentifier | null;
  dispatch: React.Dispatch<AppAction>;
  /** Convenience methods for common operations */
  addPage: (label: string, at?: number) => void;
  addPageAtEnd: (label: string) => void;
  deletePage: (id: UniqueIdentifier) => void;
  reorderPages: (activeId: UniqueIdentifier, overId: UniqueIdentifier) => void;
  setHighlightedPageId: (id: UniqueIdentifier | null) => void;
}

interface AppProviderProps {
  children: ReactNode;
}

/**
 * Generates a unique identifier for new pages
 * Uses timestamp and random number to ensure uniqueness
 */
function generatePageId(): string {
  return `page-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

/**
 * Reducer function that handles all state modifications for the application
 * Implements immutable updates for all page operations
 *
 * @param state - Current application state
 * @param action - Action to perform on the state
 * @returns New state after applying the action
 */
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

      // Insert at specified position or append to end
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
        highlightedPageId: newPage.id, // Auto-highlight newly added page
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

    case 'DELETE_PAGE': {
      const filteredPages = state.pages.filter(
        (page) => page.id !== action.payload.id
      );
      return {
        ...state,
        pages: filteredPages,
        // Clear highlight if the deleted page was highlighted
        highlightedPageId:
          state.highlightedPageId === action.payload.id
            ? null
            : state.highlightedPageId,
      };
    }

    case 'REORDER_PAGES': {
      const { activeId, overId } = action.payload;
      const oldIndex = state.pages.findIndex((p) => p.id === activeId);
      const newIndex = state.pages.findIndex((p) => p.id === overId);

      if (oldIndex === -1 || newIndex === -1) return state;

      // Implement array move logic inline to avoid external dependencies
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

// Initial state for the application
const initialState: AppState = {
  pages: [],
  highlightedPageId: null,
};

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Provider component that wraps the application and provides page management functionality
 *
 * This component sets up the reducer-based state management and provides convenient
 * helper functions for common operations like adding, deleting, and reordering pages.
 *
 * @param children - React nodes to be wrapped by the provider
 */
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
