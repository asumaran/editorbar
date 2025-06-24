# Refactorización del Estado de Páginas con Reducer

## Objetivo
Centralizar la lógica de negocio relacionada con la gestión de páginas usando un reducer en el contexto de la aplicación, removiendo la lógica dispersa en los componentes.

## Cambios Implementados

### 1. Nuevo Context con Reducer (`src/context/AppContext.tsx`)

**Antes:**
- Estado manejado con `useState` en el contexto
- Lógica de negocio dispersa en cada componente
- Funciones `setPages` y `setHighlightedPageId` expuestas directamente

**Después:**
- Estado centralizado con `useReducer`
- Acciones bien definidas para cada operación
- Funciones helper para facilitar el uso

#### Acciones Disponibles:
- `SET_PAGES`: Inicializar páginas
- `ADD_PAGE`: Agregar página en posición específica (usado por AddPage)
- `ADD_PAGE_AT_END`: Agregar página al final (usado por AddPageButton)
- `DELETE_PAGE`: Eliminar página por ID
- `REORDER_PAGES`: Reordenar páginas (drag & drop)
- `SET_HIGHLIGHTED_PAGE`: Destacar página específica

#### Funciones Helper:
```typescript
const {
  addPage,        // (label: string, at?: number) => void
  addPageAtEnd,   // (label: string) => void
  deletePage,     // (id: UniqueIdentifier) => void
  reorderPages,   // (activeId: UniqueIdentifier, overId: UniqueIdentifier) => void
  setHighlightedPageId // (id: UniqueIdentifier | null) => void
} = useAppContext();
```

### 2. AddPage Component (`src/components/AddPage/index.tsx`)

**Antes:**
```tsx
// Lógica de negocio compleja en el componente
setPages((prevPages) => {
  const newPage = { id, label: 'New Page' };
  return [
    ...prevPages.slice(0, at + 1),
    newPage,
    ...prevPages.slice(at + 1),
  ];
});
```

**Después:**
```tsx
// Lógica simple delegada al contexto
addPage('New Page', at);
```

### 3. PageBar Component (`src/components/PageBar/index.tsx`)

**Antes:**
```tsx
// Lógica de reordenamiento compleja
setPages((currentPages) => {
  const oldIndex = currentPages.findIndex((p) => p.id === active.id);
  const newIndex = currentPages.findIndex((p) => p.id === over.id);
  return arrayMove(currentPages, oldIndex, newIndex);
});
```

**Después:**
```tsx
// Lógica simple delegada al contexto
reorderPages(active.id, over.id);
```

### 4. Nueva Funcionalidad: Delete Page

Se implementó la funcionalidad de eliminación de páginas en `PageBarItem`:

```tsx
// En PageBarItem/index.tsx
function handleDeletePage() {
  setIsActive(false);
  deletePage(id);
}

// En el menú dropdown
<DropdownItem variant='danger' onClick={handleDeletePage}>
  <Trash2 /> Delete
</DropdownItem>
```

## Beneficios de la Refactorización

### 1. **Separación de Responsabilidades**
- Componentes se enfocan solo en UI y eventos
- Lógica de negocio centralizada en el reducer
- Más fácil de testear y mantener

### 2. **Consistencia**
- Todas las operaciones siguen el mismo patrón
- Generación de IDs centralizada
- Manejo consistente del highlighting

### 3. **Extensibilidad**
- Fácil agregar nuevas acciones (ej: duplicate, rename)
- Reducer patterns permiten middleware (logging, undo/redo)
- Mejor para optimizaciones futuras

### 4. **Código Más Limpio**
- Componentes más pequeños y focalizados
- Menos duplicación de lógica
- Mejor legibilidad y mantenimiento

## Ejemplo de Uso

```tsx
// Para agregar una página después de una posición específica
addPage('Nueva Página', 2); // Agrega después del índice 2

// Para agregar al final
addPageAtEnd('Página Final');

// Para eliminar una página
deletePage('page-123');

// Para reordenar páginas (drag & drop)
reorderPages('page-1', 'page-2');
```

## Patrones Implementados

### 1. **Reducer Pattern**
- Estado inmutable
- Acciones tipadas
- Lógica centralizada

### 2. **Helper Functions**
- Abstracción sobre dispatch
- API más limpia para componentes
- Mejor developer experience

### 3. **Single Responsibility**
- Cada función tiene un propósito específico
- Componentes solo manejan UI
- Contexto solo maneja estado

## Consideraciones de Performance

- **ID Generation**: Centralizada para evitar duplicados
- **Immutable Updates**: Garantiza re-renders correctos
- **Helper Functions**: No se recrean en cada render
- **Action Dispatch**: Más eficiente que múltiples useState

## Testing

El nuevo patrón facilita el testing:

```tsx
// Test del reducer
const newState = appReducer(initialState, {
  type: 'ADD_PAGE',
  payload: { label: 'Test Page', at: 1 }
});

// Test de componentes con mock del contexto
const mockContext = {
  addPage: jest.fn(),
  deletePage: jest.fn(),
  // ...
};
```

Esta refactorización mejora significativamente la mantenibilidad y extensibilidad del código, siguiendo las mejores prácticas de React y patrones de arquitectura de frontend.
