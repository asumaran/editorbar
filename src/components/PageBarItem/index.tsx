import { CSS } from '@dnd-kit/utilities';
import {
  defaultAnimateLayoutChanges,
  useSortable,
  type AnimateLayoutChanges,
} from '@dnd-kit/sortable';
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
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

interface Props {
  children: ReactNode;
  id: UniqueIdentifier;
  index: number;
  isHighlighted?: boolean;
}

export default function PageBarItem({
  children,
  id,
  index,
  isHighlighted,
}: Props) {
  const [isActive, setIsActive] = useState(false);
  const buttonRef = useRef<HTMLElement>(null);

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

  function handleOnContextMenu(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsActive(true);
  }

  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
      }
    }

    if (isActive) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isActive]);

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

    // Prevent Radix UI from opening the menu on any click
    // This is a workaround for the conflict between radix and dndkit
    // both use the pointer down event to open/drag the button
    e.preventDefault();
    e.stopPropagation();
  };

  // Create modified listeners without onPointerDown and onMouseDown
  const modifiedListeners = {
    ...listeners,
    onPointerDown: undefined,
    onMouseDown: undefined,
  };

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
  const [highlightStage, setHighlightStage] = useState<'none' | 'dark'>('none');

  // Animate background when highlighted
  useEffect(() => {
    if (isHighlighted) {
      setHighlightStage('dark');
      const toNone = setTimeout(() => setHighlightStage('none'), 300);
      return () => {
        clearTimeout(toNone);
      };
    } else {
      setHighlightStage('none');
    }
  }, [isHighlighted]);

  return (
    <DropdownMenu.Root open={isActive} onOpenChange={setIsActive}>
      <div
        ref={combinedRef}
        className={cx(
          'PageBarItemWrapper origin-top-left',
          isDragging ? 'opacity-0 z-0' : ''
        )}
        style={style}
      >
        <DropdownMenu.Trigger asChild>
          <Button
            {...attributes}
            {...modifiedListeners}
            className={cx(
              'transition-colors duration-500',
              isDragging && 'opacity-0 z-0',
              highlightStage === 'dark' && 'bg-gray-300 border-b-gray-300'
            )}
            style={{
              willChange: 'background-color',
            }}
            id={String(id)}
            key={id}
            onContextMenu={handleOnContextMenu}
            onPointerDown={handlePointerDown}
            variant={isActive ? 'active' : 'default'}
          >
            <FileText
              key={1}
              color={isActive ? 'rgb(245,157,14)' : 'currentColor'}
              width={15}
            />
            <span key={2}>{children}</span>
            <span key={3} className={isActive ? 'block' : 'hidden'}>
              <EllipsisVertical width={16} height={16} color='#9DA4B2' />
            </span>
          </Button>
        </DropdownMenu.Trigger>
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
            <DropdownItem variant='danger'>
              <Trash2 /> Delete
            </DropdownItem>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
