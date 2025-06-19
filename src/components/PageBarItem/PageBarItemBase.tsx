import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import classNames from 'classnames';
import type { ReactNode } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';

interface Props {
  children: ReactNode;
  id: UniqueIdentifier;
}

export default function PageBarItemBase({ children, id }: Props) {
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
    <div
      key={id}
      id={String(id)}
      ref={setNodeRef}
      style={style}
      className={classNames(
        'inline-block w-[100px] border px-5 py-1 rounded-md bg-white',
        isDragging ? 'opacity-0 z-0' : ''
      )}
      {...attributes}
      {...listeners}
      onClick={handleOnClick}
    >
      {children}
    </div>
  );

  function handleOnClick() {
    console.log('PageBarItemBase - handleOnClick');
  }
}
