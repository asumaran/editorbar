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
import PageBarItemOverlay from '../PageBarItem/PageBarItemOverlay';
import PageBarItemBase from '../PageBarItem/PageBarItemBase';
import AddPage from '../AddPage';
import useAppContext from '../../hooks/useAppContext';
import type { Page } from '../../context/AppContext';

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
        <PageBarItemBase key={page.id} id={page.id}>
          {page.label}
        </PageBarItemBase>
      );

      // Add AddPage component between items (not after the last one)
      if (index < pages.length - 1) {
        items.push(<AddPage at={index} key={`addpage-${index}`} />);
      }
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
        <div className='border border-gray-200 flex py-2.5 px-3 rounded-lg'>
          {barItemsWithAddPage}
        </div>
      </SortableContext>
      <DragOverlay>
        {isDragging && activePage && activeId ? (
          <PageBarItemOverlay id={activePage.id}>
            {activePage.label}
          </PageBarItemOverlay>
        ) : null}
      </DragOverlay>
    </DndContext>
  );

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
