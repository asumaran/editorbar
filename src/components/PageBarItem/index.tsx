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
}

export default function PageBarItem({ children, id }: Props) {
  const [isActive, setIsActive] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // TODO: This might be used to animate insert/delete items
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

  const style = { transform: CSS.Transform.toString(transform), transition };

  function handleOnContextMenu(e: MouseEvent<HTMLButtonElement>) {
    console.log('context menu');
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

  const combinedRef = (node: HTMLButtonElement | null) => {
    // Set the dnd-kit ref
    setNodeRef(node);
    // Set our own ref for positioning
    buttonRef.current = node;
  };

  // Combinar los listeners de dnd-kit con control personalizado
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Solo permitir que dnd-kit maneje el evento si no es click derecho
    if (e.button !== 2) {
      // Llamar al listener de dnd-kit si existe
      if (listeners?.onPointerDown) {
        listeners.onPointerDown(e);
      }
    }

    // Prevenir que Radix UI abra el menú en cualquier click
    // Esto es una salida al conflicto entre radix y dndkit
    // ambos usan el evento pointer down para abrir/arrastrar el boton
    console.log('pasa por aca');
    e.preventDefault();
    e.stopPropagation();
  };

  // Crear listeners modificados sin onPointerDown y onMouseDown
  const modifiedListeners = {
    ...listeners,
    onPointerDown: undefined,
    onMouseDown: undefined,
  };

  return (
    <DropdownMenu.Root open={isActive} onOpenChange={setIsActive}>
      <DropdownMenu.Trigger asChild>
        <Button
          {...attributes}
          {...modifiedListeners} // Usar listeners modificados
          className={cx(isDragging ? 'opacity-0 z-0' : '')}
          id={String(id)}
          key={id}
          onContextMenu={handleOnContextMenu}
          ref={combinedRef}
          style={style}
          onPointerDown={handlePointerDown} // Handler personalizado
        >
          <FileText
            color={isActive ? 'rgb(245,157,14)' : 'currentColor'}
            width={15}
          />
          <span>{children}</span>
          <span className={isActive ? 'block' : 'hidden'}>
            <EllipsisVertical width={16} height={16} color='#9DA4B2' />
          </span>
        </Button>
      </DropdownMenu.Trigger>
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
