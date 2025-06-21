import { useState, useMemo, useEffect, type ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import AddPage from '../AddPage';
import useAppContext from '../../hooks/useAppContext';
import type { Page } from '../../context/AppContext';
import AddPageButton from '../AddPageButton';
import PageBarItem from '../PageBarItem';

interface Props {
  initialPages: Page[];
}

export default function PageBar({ initialPages }: Props) {
  const { pages, setPages } = useAppContext();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    setPages(initialPages);
  }, [initialPages, setPages]);

  const barItemsWithAddPage = useMemo(() => {
    const items: ReactNode[] = [];

    pages.forEach((page, index) => {
      // Add the PageBarItem
      items.push(
        <PageBarItem key={page.id} id={page.id}>
          {page.label}
        </PageBarItem>
      );

      items.push(<AddPage at={index} key={`addpage-${index}`} />);
    });

    return items;
  }, [pages]);

  const activePage = pages.find((p) => p.id === activeId);

  return (
    <DndContext
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <SortableContext items={pages}>
        <div className='border border-gray-200 bg-[rgb(249,250,251)]  rounded-lg'>
          <div className='foo flex py-4 px-5 relative'>
            {/* Dashed line */}
            <div className='absolute top-1/2 left-5 right-5 h-px border-t border-dashed border-[rgb(192,192,192)] z-0'></div>

            {/* Content */}
            <div className='relative z-10 flex w-full'>
              {barItemsWithAddPage}
              <AddPageButton variant='light' onClick={handleAddPageClick} />
            </div>
          </div>
        </div>
      </SortableContext>
      <DragOverlay>
        {isDragging && activePage && activeId ? (
          <PageBarItem id={activePage.id}>{activePage.label}</PageBarItem>
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  function handleAddPageClick() {
    setPages((p) => {
      const id = Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
      const newPage = { id: id, label: 'Other' };
      return [...p, newPage];
    });
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setIsDragging(true);
    setActiveId(active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over !== null && active.id !== over.id) {
      setPages((currentPages) => {
        const oldIndex = currentPages.findIndex((p) => p.id === active.id);
        const newIndex = currentPages.findIndex((p) => p.id === over.id);
        return arrayMove(currentPages, oldIndex, newIndex);
      });
    }

    setIsDragging(false);
    setActiveId(null);
  }
}
