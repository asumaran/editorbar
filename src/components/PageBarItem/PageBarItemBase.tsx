import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import classNames from 'classnames';
import { useRef, useState, type ReactNode } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { EllipsisVertical, FileText } from 'lucide-react';
import MenuPortal from '../PageSettingsMenu/MenuPortal';
import PageSettingsMenu from '../PageSettingsMenu';

interface Props {
  children: ReactNode;
  id: UniqueIdentifier;
}

export default function PageBarItemBase({ children, id }: Props) {
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
      <button
        key={id}
        id={String(id)}
        ref={setNodeRef}
        style={style}
        className={classNames(
          'text-[#677289] bg-[#F0F1F3] border-[#F0F1F3] hover:bg-[rgb(221,223,228)] hover:border-[rgb(221,223,228)] select-none border px-3 pl-2 py-1 rounded-lg',
          isDragging ? 'opacity-0 z-0' : '',
          isActive ? 'bg-white active:bg-white pr-1' : ''
        )}
        {...attributes}
        {...listeners}
        onClick={handleOnClick}
      >
        <span className='flex items-center gap-1'>
          <span>
            <FileText height={16} />
          </span>
          <span>{children}</span>
          <span className={isActive ? 'block' : 'hidden'}>
            <EllipsisVertical height={16} color='#9DA4B2' />
          </span>
        </span>
      </button>
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
