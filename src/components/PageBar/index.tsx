import {
  Children,
  useState,
  useMemo,
  type ComponentProps,
  type ReactElement,
} from 'react';
import PageBarItem from '../PageBarItem';
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import PageBarItemOverlay from '../PageBarItem/PageBarItemOverlay';
import PageBarItemBase from '../PageBarItem/PageBarItemBase';

interface Props {
  children: ReactElement<ComponentProps<typeof PageBarItem>>[];
}

export default function PageBar({ children }: Props) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { initialItems, childrenMap } = useMemo(() => {
    const childrenIds: string[] = [];
    const childrenMap: Record<
      string,
      ReactElement<ComponentProps<typeof PageBarItem>>
    > = {};

    type PageBarItemElement = ReactElement<ComponentProps<typeof PageBarItem>>;

    // Generate stable IDs and create PageBarItemBase elements for each child
    Children.forEach(children, (c: PageBarItemElement, index) => {
      const id = `pagebar-item-${index}`;
      childrenIds.push(id);
      const element = (
        <PageBarItemBase key={id} id={id}>
          {c.props.children}
        </PageBarItemBase>
      );
      childrenMap[id] = element;
    });

    return { initialItems: childrenIds, childrenMap };
  }, [children]); // Dependency on children to detect changes

  // Use lazy initialization to prevent state reset during HMR
  const [items, setItems] = useState(() => initialItems);

  // Synchronize items when initialItems change (useful for development)
  useMemo(() => {
    setItems((currentItems) => {
      // Only reinitialize if the number of children changed
      if (currentItems.length !== initialItems.length) {
        return initialItems;
      }
      return currentItems;
    });
  }, [initialItems]);

  // Create ordered children based on current items order
  const newChildren = items.map((id) => childrenMap[id]);

  return (
    <DndContext
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <SortableContext items={items}>
        <div className='border flex gap-3 p-2 rounded-md'>{newChildren}</div>
      </SortableContext>
      <DragOverlay>
        {isDragging && activeId ? (
          <PageBarItemOverlay id={activeId}>
            {childrenMap[String(activeId)]?.props.children}
          </PageBarItemOverlay>
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setIsDragging(true);
    setActiveId(String(active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over !== null && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(String(active.id));
        const newIndex = items.indexOf(String(over.id));
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setIsDragging(false);
    setActiveId(null);
  }
}
