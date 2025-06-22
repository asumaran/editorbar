import { CSS } from '@dnd-kit/utilities';
import {
  defaultAnimateLayoutChanges,
  useSortable,
  type AnimateLayoutChanges,
} from '@dnd-kit/sortable';
import { useRef, useState, type MouseEvent, type ReactNode } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { EllipsisVertical, FileText } from 'lucide-react';
import MenuPortal from '../MenuPortal';
import PageSettingsMenu from '../PageSettingsMenu';
import Button from '../Button';
import { cx } from 'class-variance-authority';

interface Props {
  children: ReactNode;
  id: UniqueIdentifier;
}

export default function PageBarItem({ children, id }: Props) {
  const [isActive, setIsActive] = useState<boolean>();
  const buttonRef = useRef<HTMLDivElement>(null);

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
  return (
    <div className='relative' ref={buttonRef}>
      <Button
        key={id}
        id={String(id)}
        ref={setNodeRef}
        style={style}
        className={cx(isDragging ? 'opacity-0 z-0' : '')}
        {...attributes}
        {...listeners}
        onContextMenu={handleOnContextMenu}
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
      <MenuPortal
        isOpen={isActive}
        buttonRef={buttonRef}
        onClose={handleOnCloseDropdown}
      >
        <PageSettingsMenu />
      </MenuPortal>
    </div>
  );

  function handleOnContextMenu(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsActive((p) => !p);
  }

  function handleOnCloseDropdown() {
    setIsActive(false);
  }
}
