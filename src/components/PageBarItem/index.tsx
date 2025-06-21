import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useRef, useState, type ReactNode } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { EllipsisVertical, FileText } from 'lucide-react';
import MenuPortal from '../PageSettingsMenu/MenuPortal';
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

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

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
        onClick={handleOnClick}
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
        onClose={closeDropdown}
      >
        <PageSettingsMenu />
      </MenuPortal>
    </div>
  );

  function handleOnClick() {
    setIsActive((p) => !p);
  }

  function closeDropdown() {
    setIsActive(false);
  }
}
