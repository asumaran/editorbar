# EditorBar

A modern, interactive page management component built with React, TypeScript, and Tailwind CSS. Features draggable pages, context menus, and a beautiful user interface.

## 🚀 Live Demo

Check out the live application: **[https://asumaran.github.io/editorbar/](https://asumaran.github.io/editorbar/)**

## ✨ Features

- **🖱️ Drag & Drop**: Reorder pages with smooth drag and drop functionality.
- **📝 Page Management**: Add, delete, and manage pages easily.
- **🔧 Context Menu**: Right-click context menu for page operations.
- **♿ Accessible**: Built with accessibility in mind using Radix UI primitives.

## 🛠️ Tech Stack

- **React 19** - UI framework.
- **TypeScript** - Type safety.
- **Tailwind CSS v4** - Styling.
- **Radix UI** - Accessible components.
- **@dnd-kit** - Drag and drop functionality.
- **Vite** - Build tool and dev server.
- **Lucide React** - Beautiful icons.

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or higher).
- **npm** or **yarn** package manager.

## 🏗️ Installation

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

## 🚀 Running the Project

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

## 🎮 How to Use

1. **Add Pages**: Click the "+" button between pages or use the "Add Page" button at the end.
2. **Reorder Pages**: Drag and drop pages to reorder them.
3. **Delete Pages**: Right-click on any page and select "Delete" from the context menu.
4. **Context Menu**: Right-click on pages to access additional options.

## 🏗️ Architecture

The project uses a modern React architecture with:

- **Centralized State Management**: Uses `useReducer` with Context API for global state.
- **Component Composition**: Modular, reusable components.
- **Type Safety**: Full TypeScript implementation.
- **Accessibility First**: Built with Radix UI primitives.
- **Performance Optimized**: Efficient rendering and state updates.

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

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Alex Sumaran** - [@asumaran](https://github.com/asumaran)

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible component primitives.
- [dnd kit](https://dndkit.com/) for drag and drop functionality.
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
- [Lucide](https://lucide.dev/) for beautiful icons.
- [Google Fonts](https://fonts.google.com/specimen/Inter?query=inter) for the Inter font.
