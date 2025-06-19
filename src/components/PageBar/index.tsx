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

interface Props {
  children: ReactElement<ComponentProps<typeof PageBarItem>>[];
}

export default function PageBar({ children }: Props) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 1,
      },
    })
  );

  const { initialItems, childrenMap, renderOrder } = useMemo(() => {
    const childrenIds: string[] = [];
    const childrenMap: Record<
      string,
      ReactElement<ComponentProps<typeof PageBarItem>>
    > = {};
    const renderOrder: Array<{
      type: 'sortable' | 'static';
      id: string;
      element?: ReactElement;
    }> = [];

    type PageBarItemElement = ReactElement<ComponentProps<typeof PageBarItem>>;

    // Generate stable IDs and create PageBarItemBase elements for each child
    Children.forEach(children, (child: PageBarItemElement, index) => {
      const id = `pagebar-item-${index}`;
      childrenIds.push(id);
      const element = (
        <PageBarItemBase key={id} id={id}>
          {child.props.children}
        </PageBarItemBase>
      );
      childrenMap[id] = element;
      renderOrder.push({ type: 'sortable', id });

      // Add AddPage component after each PageBarItem (except the last one)
      if (index < children.length - 1) {
        const addPageId = `addpage-${index}`;
        const addPageElement = <AddPage key={addPageId} />;
        renderOrder.push({
          type: 'static',
          id: addPageId,
          element: addPageElement,
        });
      }
    });

    return { initialItems: childrenIds, childrenMap, renderOrder };
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

  // Create ordered children with AddPage between PageBarItems
  const createOrderedChildren = () => {
    let sortableIndex = 0;

    return renderOrder.map((item) => {
      if (item.type === 'static') {
        // Static AddPage components stay in their position
        return item.element;
      } else {
        // Get the next sortable item from the reordered array
        const sortableId = items[sortableIndex];
        sortableIndex++;
        return childrenMap[sortableId];
      }
    });
  };

  const orderedChildren = createOrderedChildren();

  return (
    <DndContext
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <SortableContext items={items}>
        <div className='border flex gap-3 p-2 rounded-md'>
          {orderedChildren}
        </div>
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
