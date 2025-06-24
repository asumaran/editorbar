# EditorBar - Technical Documentation

## Overview

EditorBar is a sophisticated React component for managing draggable pages with context menus. This document provides detailed technical information about the key components, functions, and architectural decisions.

## Core Components

### 1. AppContext (`src/context/AppContext.tsx`)

**Purpose**: Centralized state management using React's useReducer pattern.

**Key Types**:
```typescript
interface Page {
  id: UniqueIdentifier;
  label: string;
}

type AppAction = 
  | { type: 'ADD_PAGE'; payload: { label: string; at?: number } }
  | { type: 'DELETE_PAGE'; payload: { id: UniqueIdentifier } }
  | { type: 'REORDER_PAGES'; payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier } }
  | { type: 'SET_HIGHLIGHTED_PAGE'; payload: { id: UniqueIdentifier | null } }
```

**Key Functions**:
- `generatePageId()`: Creates unique identifiers using timestamp and random numbers
- `appReducer()`: Pure function that handles all state transitions immutably
- `AppProvider`: Context provider that wraps the application with state management

### 2. PageBar (`src/components/PageBar/index.tsx`)

**Purpose**: Main orchestration component for the page management UI.

**Key Features**:
- Integrates `@dnd-kit` for drag and drop functionality
- Manages drag overlays and visual feedback
- Handles page highlighting with automatic timeout
- Coordinates between drag operations and add page functionality

**Complex Logic**:
- `barItemsWithAddPage`: Dynamically generates alternating PageBarItem and AddPage components
- Drag event handlers coordinate between visual state and context actions
- Uses `useMemo` for performance optimization of item generation

### 3. PageBarItem (`src/components/PageBarItem/index.tsx`)

**Purpose**: Individual page representation with advanced interaction handling.

**Key Features**:
- **Dual Event Handling**: Coordinates drag operations with context menu triggers
- **Accessibility**: Full ARIA support with proper labels and states
- **Visual States**: Handles highlighting, dragging, active, and hover states
- **Context Menu Integration**: Uses Radix UI for accessible dropdown menus

**Complex Event Coordination**:
```typescript
const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
  // Right clicks (button 2) trigger context menu
  if (e.button === 2) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  
  // Left clicks enable drag functionality
  if (listeners?.onPointerDown) {
    listeners.onPointerDown(e);
  }
};
```

### 4. AddPage (`src/components/AddPage/index.tsx`)

**Purpose**: Provides insertion points for new pages between existing ones.

**Key Features**:
- **Delayed Visibility**: Uses timeout-based approach to prevent flickering
- **Memory Management**: Automatic cleanup of timeouts to prevent leaks
- **UX Optimization**: Smooth transitions when hovering between adjacent buttons

**Timeout Management**:
```typescript
function showWithDelay(delay: number = 0) {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }
  
  timeoutRef.current = window.setTimeout(() => {
    setIsVisible(true);
  }, delay);
}
```

## State Management Architecture

### Reducer Pattern
The application uses a reducer pattern for predictable state updates:

1. **Actions**: Dispatch actions with type and payload
2. **Reducer**: Pure function that returns new state
3. **Context**: Provides state and dispatch to components
4. **Helpers**: Convenience functions that wrap common dispatch calls

### State Flow
```
User Interaction → Action Dispatch → Reducer → New State → UI Update
```

### Key Actions Explained

- **ADD_PAGE**: Inserts a page at a specific position, automatically highlights it
- **DELETE_PAGE**: Removes a page and clears highlighting if it was the highlighted page
- **REORDER_PAGES**: Implements array move logic for drag and drop operations
- **SET_HIGHLIGHTED_PAGE**: Controls visual highlighting with automatic timeout

## Event Handling Coordination

### Challenge: Dual Interaction Modes
The PageBarItem component must handle both:
1. Left-click + drag for reordering (@dnd-kit)
2. Right-click for context menu (Radix UI)

### Solution: Custom Event Coordination
- **Pointer Events**: Use `onPointerDown` to detect click type before delegation
- **Event Prevention**: Prevent unwanted interactions between systems
- **State Synchronization**: Ensure dropdown state doesn't interfere with drag operations

### Accessibility Considerations
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management during interactions
- Screen reader announcements for state changes

## Performance Optimizations

### 1. Memoization Strategy
- **PageBar**: Uses `useMemo` for expensive item generation
- **Avoided**: Over-memoization of simple components to prevent complexity

### 2. Event Handler Optimization
- **Debounced Visibility**: AddPage component uses timeouts to prevent flickering
- **Efficient Listeners**: Only attach necessary event listeners

### 3. Animation Performance
- **CSS Transforms**: Use CSS transforms for smooth animations
- **Hardware Acceleration**: Leverage GPU for drag operations
- **Minimal Reflows**: Avoid layout thrashing during drag operations

## Testing Considerations

### Key Testing Areas
1. **State Management**: Test reducer functions with various action combinations
2. **Event Coordination**: Verify drag and context menu don't interfere
3. **Accessibility**: Test keyboard navigation and screen reader compatibility
4. **Performance**: Test with large numbers of pages
5. **Edge Cases**: Test with empty states, single pages, rapid interactions

### Potential Edge Cases
- Rapid clicking while dragging
- Context menu open during drag operations
- Multiple simultaneous add operations
- Page deletion while highlighted
- Drag operations on touch devices

## Browser Compatibility

### Supported Features
- **Pointer Events**: Modern pointer event handling
- **CSS Custom Properties**: For dynamic styling
- **Flexbox**: For layout
- **CSS Transforms**: For animations

### Fallback Strategies
- Graceful degradation for older browsers
- Touch event handling for mobile devices
- Reduced animation for performance-limited devices

## Future Enhancements

### Potential Improvements
1. **Persistence**: Save page order to localStorage or backend
2. **Undo/Redo**: Implement command pattern for action history
3. **Virtualization**: Handle large numbers of pages efficiently
4. **Theming**: Dynamic color schemes and customization
5. **Keyboard Shortcuts**: Power user features
6. **Multi-selection**: Bulk operations on multiple pages

### Architecture Extensibility
The current architecture is designed to support:
- Additional action types in the reducer
- New component variants
- Extended page properties
- Plugin system for custom functionality
