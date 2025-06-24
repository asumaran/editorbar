# EditorBar

A modern, interactive page management component built with React, TypeScript, and Tailwind CSS. Features draggable pages, context menus, and a beautiful user interface.

## Technical Documentation

For detailed technical information about the architecture, components, and implementation details, see [DOCUMENTATION.md](./DOCUMENTATION.md).

## Live Demo

Check out the live application: **[https://asumaran.github.io/editorbar/](https://asumaran.github.io/editorbar/)**

## Features

- **Drag & Drop**: Reorder pages with smooth drag and drop functionality.
- **Page Management**: Add, delete, and manage pages easily.
- **Context Menu**: Right-click context menu for page operations.
- **Accessible**: Built with accessibility in mind using Radix UI primitives.

## Tech Stack

- **React 19** - UI framework.
- **TypeScript** - Type safety.
- **Tailwind CSS v4** - Styling.
- **Radix UI** - Accessible components.
- **@dnd-kit** - Drag and drop functionality.
- **Vite** - Build tool and dev server.
- **Lucide React** - Beautiful icons.

## Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or higher).
- **npm** or **yarn** package manager.

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/asumaran/editorbar.git
   cd editorbar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or with yarn:
   ```bash
   yarn install
   ```

## Running the Project

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/editorbar/`.

### Production Build

Build the project for production:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

## How to Use

1. **Add Pages**: Click the "+" button between pages or use the "Add Page" button at the end.
2. **Reorder Pages**: Drag and drop pages to reorder them.
3. **Delete Pages**: Right-click on any page and select "Delete" from the context menu.
4. **Context Menu**: Right-click on pages to access additional options.

## Architecture

The project uses a modern React architecture with:

- **Centralized State Management**: Uses `useReducer` with Context API for global state.
- **Component Composition**: Modular, reusable components.
- **Type Safety**: Full TypeScript implementation.
- **Accessibility First**: Built with Radix UI primitives.
- **Performance Optimized**: Efficient rendering and state updates.

### Key Components

#### `AppContext` & `AppProvider`
- **Purpose**: Centralized state management for all page operations
- **Features**: Reducer-based state updates, helper functions for common actions
- **Actions**: `ADD_PAGE`, `DELETE_PAGE`, `REORDER_PAGES`, `SET_HIGHLIGHTED_PAGE`

#### `PageBar`
- **Purpose**: Main container that orchestrates the page management UI
- **Features**: Drag and drop integration, visual feedback, page highlighting
- **Dependencies**: `@dnd-kit` for drag operations, manages drag overlays and animations

#### `PageBarItem`
- **Purpose**: Individual page representation with interaction capabilities
- **Features**: Context menu (right-click), drag handle, visual states, accessibility
- **Complex Logic**: Coordinates between drag-and-drop and dropdown menu interactions

#### `AddPage`
- **Purpose**: Insert new pages at specific positions between existing pages
- **Features**: Delayed visibility states, hover effects, keyboard accessibility
- **UX**: Prevents flickering when moving between adjacent add buttons

### Event Handling Architecture

The application uses a sophisticated event handling system to coordinate between:

1. **Drag & Drop Events** (`@dnd-kit`)
   - Left-click and drag for reordering pages
   - Visual feedback with drag overlays
   - Horizontal-only dragging with collision detection

2. **Context Menu Events** (`Radix UI`)
   - Right-click to open dropdown menus
   - Keyboard navigation support
   - Automatic focus management

3. **Coordination Logic**
   - Prevents conflicts between drag and context menu
   - Proper event propagation control
   - State synchronization between components

### State Management

The app uses a reducer pattern for managing pages:

```typescript
// Available actions
- ADD_PAGE: Add a page at specific position.
- ADD_PAGE_AT_END: Add a page at the end.
- DELETE_PAGE: Remove a page by ID.
- REORDER_PAGES: Reorder pages via drag & drop.
- SET_HIGHLIGHTED_PAGE: Highlight a specific page.
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Alex Sumaran** - [@asumaran](https://github.com/asumaran)

## Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible component primitives.
- [dnd kit](https://dndkit.com/) for drag and drop functionality.
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
- [Lucide](https://lucide.dev/) for beautiful icons.
- [Google Fonts](https://fonts.google.com/specimen/Inter?query=inter) for the Inter font.

