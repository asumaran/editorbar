import { CSS } from '@dnd-kit/utilities';
import {
  defaultAnimateLayoutChanges,
  useSortable,
  type AnimateLayoutChanges,
} from '@dnd-kit/sortable';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import {
  Clipboard,
  Copy,
  EllipsisVertical,
  FileText,
  Flag,
  PencilLine,
  Trash2,
} from 'lucide-react';
import Button from '../Button';
import { cx } from 'class-variance-authority';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import DropdownItem from '../DropdownItem';
import useAppContext from '../../hooks/useAppContext';

interface PageBarItemProps {
  children: ReactNode;
  id: UniqueIdentifier;
  index: number;
  isHighlighted?: boolean;
}

/**
 * PageBarItem represents an individual page in the page bar
 *
 * This component handles:
 * - Drag and drop functionality for reordering
 * - Right-click context menu with page operations
 * - Visual states (highlighted, dragging, active)
 * - Accessibility features and ARIA attributes
 *
 * The component integrates @dnd-kit for drag operations and Radix UI for
 * the dropdown menu. It carefully manages event handling to ensure proper
 * coordination between drag operations and context menu triggers.
 *
 * @param children - The page label/content to display
 * @param id - Unique identifier for the page
 * @param index - Position index for animations and sorting
 * @param isHighlighted - Whether this page should show highlight animation
 */
export default function PageBarItem({
  children,
  id,
  index,
  isHighlighted = false,
}: PageBarItemProps) {
  const { deletePage } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const buttonRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // This is used to animate insert/delete items
  const animateLayoutChanges: AnimateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, animateLayoutChanges });

  function handleDeletePage() {
    // Delete the page using the context action
    // Radix UI will close the dropdown automatically when item is clicked
    deletePage(id);
  }

  function handleContextMenu(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(true);
  }

  /**
   * Complex event handler that coordinates between drag-and-drop and context menu functionality
   *
   * This function manages the delicate balance between:
   * - @dnd-kit's drag functionality (left click + drag)
   * - Radix UI's dropdown trigger (right click)
   * - Preventing unintended interactions between the two
   *
   * The logic ensures that:
   * - Right clicks (button 2) open the context menu and prevent drag
   * - Left clicks enable drag functionality when not right-clicking
   * - The dropdown closes when interacting with drag operations
   */
  const combinedRef = (node: HTMLElement | null) => {
    // Set the dnd-kit ref
    setNodeRef(node);
    // Set our own ref for positioning
    buttonRef.current = node;
  };

  // Combine dnd-kit listeners with custom control
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Only allow dnd-kit to handle the event if it's not a right click
    if (e.button !== 2) {
      // Call dnd-kit listener if it exists
      if (listeners?.onPointerDown) {
        listeners.onPointerDown(e);
      }
    }

    // For right clicks, prevent Radix UI from handling it automatically
    if (e.button === 2) {
      e.preventDefault();
      e.stopPropagation();
    }

    // For all other interactions, let them pass through but prevent dropdown
    if (e.button !== 2 && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  // Create modified listeners with controlled pointer events
  // We handle onPointerDown manually in handlePointerDown
  // to coordinate between dnd-kit and Radix UI
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onPointerDown, onMouseDown, ...modifiedListeners } = listeners || {};

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    '--translate-x': transform ? `${Math.round(transform.x)}px` : undefined,
    '--translate-y': transform ? `${Math.round(transform.y)}px` : undefined,
    '--scale-x': transform?.scaleX ? `${transform.scaleX}` : undefined,
    '--scale-y': transform?.scaleY ? `${transform.scaleY}` : undefined,
    '--index': index,
  } as React.CSSProperties;

  // State for background animation
  const [highlightStage, setHighlightStage] = useState<'none' | 'highlighted'>(
    'none'
  );

  // Animate background when highlighted
  useEffect(() => {
    if (isHighlighted) {
      setHighlightStage('highlighted');
      const timer = setTimeout(() => setHighlightStage('none'), 600); // Longer duration for better UX
      return () => {
        clearTimeout(timer);
      };
    } else {
      setHighlightStage('none');
    }
  }, [isHighlighted]);

  return (
    <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <div
        ref={combinedRef}
        className={cx(
          'PageBarItemWrapper origin-top-left relative',
          isDragging ? 'opacity-0 z-0' : ''
        )}
        style={style}
      >
        {/* Invisible trigger positioned exactly where the button is */}
        <DropdownMenu.Trigger
          ref={triggerRef}
          className='absolute inset-0 opacity-0 pointer-events-none z-[-1]'
          tabIndex={-1}
          aria-hidden='true'
        />

        {/* Main button - completely separate from dropdown trigger */}
        <Button
          {...attributes}
          {...modifiedListeners}
          className={cx(
            // Base transitions and animations
            'transition-colors duration-500',
            // Dragging states
            isDragging && 'opacity-0 z-0',
            // Highlight state with important to override variant styles
            highlightStage === 'highlighted' && '!bg-[rgb(217,220,225)]'
          )}
          id={String(id)}
          onPointerDown={handlePointerDown}
          onContextMenu={handleContextMenu}
          variant={isDropdownOpen ? 'active' : 'default'}
          aria-label={`Page ${children}. Right-click for options${
            isDropdownOpen ? ', menu open' : ''
          }`}
          aria-expanded={isDropdownOpen}
          type='button'
        >
          <FileText
            color={isDropdownOpen ? 'rgb(245,157,14)' : 'currentColor'}
            width={15}
            aria-hidden='true'
          />
          <span>{children}</span>
          <EllipsisVertical
            width={16}
            height={16}
            color={isDropdownOpen ? 'rgb(245,157,14)' : '#9DA4B2'}
            aria-hidden='true'
          />
        </Button>
      </div>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="rounded-xl shadow-xs overflow-hidden bg-white border border-[#e5e7eb] min-w-[220px] duration-[0.6s] ease-out data-[side='top']:animate-[slideDownAndFade_0.6s_ease-out]"
          side='top'
          align='start'
          sideOffset={5}
        >
          <div className='bg-[#FAFBFC] p-3 font-bold border-b border-[#E1E1E1]'>
            Settings
          </div>
          <div className='p-1'>
            <DropdownItem>
              <Flag color='blue' />
              Set as first page
            </DropdownItem>
            <DropdownItem>
              <PencilLine /> Rename
            </DropdownItem>
            <DropdownItem>
              <Clipboard /> Copy
            </DropdownItem>
            <DropdownItem>
              <Copy /> Duplicate
            </DropdownItem>
            <DropdownMenu.Separator className='h-px bg-[#e5e7eb] m-[5px]' />
            <DropdownItem variant='danger' onClick={handleDeletePage}>
              <Trash2 /> Delete
            </DropdownItem>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
