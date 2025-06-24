import { useState, useMemo, useEffect, type ReactNode } from 'react';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import AddPage from '../AddPage';
import useAppContext from '../../hooks/useAppContext';
import type { Page } from '../../context/AppContext';
import AddPageButton from '../AddPageButton';
import PageBarItem from '../PageBarItem';

interface PageBarProps {
  initialPages: Page[];
}

export default function PageBar({ initialPages }: PageBarProps) {
  const { pages, setPages, highlightedPageId, setHighlightedPageId } =
    useAppContext();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPages(initialPages);
  }, [initialPages, setPages]);

  // Clear the highlight after 2 seconds
  useEffect(() => {
    if (highlightedPageId) {
      const timeout = setTimeout(() => setHighlightedPageId(null), 300); // Animation lasts for 300ms.
      return () => clearTimeout(timeout);
    }
  }, [highlightedPageId, setHighlightedPageId]);

  const barItemsWithAddPage = useMemo(() => {
    const items: ReactNode[] = [];
    let idx = 0;
    let pidx = 0;
    while (pages.length) {
      items.push(
        <PageBarItem
          index={pidx + idx}
          key={pages[pidx].id}
          id={pages[pidx].id}
          isHighlighted={highlightedPageId === pages[pidx].id}
        >
          {pages[pidx].label}
        </PageBarItem>
      );

      items.push(
        <AddPage index={pidx + idx + 1} at={pidx} key={`addpage-${idx}`} />
      );

      if (pidx + 1 === pages.length) {
        break;
      }

      idx++;
      pidx++;
    }
    return items;
  }, [pages, highlightedPageId]);

  const activePage = pages.find((p) => p.id === activeId);

  return (
    <DndContext
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      collisionDetection={closestCenter}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
    >
      <SortableContext items={pages} strategy={horizontalListSortingStrategy}>
        <div className='border border-gray-200 bg-[rgb(249,250,251)]  rounded-lg'>
          <div className='flex py-4 px-5 relative'>
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
          <PageBarItem index={-1} id={activePage.id}>
            {activePage.label}
          </PageBarItem>
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  function handleAddPageClick() {
    const id = Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
    setPages((p) => {
      const newPage = { id: id, label: 'Other' };
      return [...p, newPage];
    });

    setHighlightedPageId(id);
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
