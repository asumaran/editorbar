import { Plus } from 'lucide-react';
import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type MouseEvent,
} from 'react';
import useAppContext from '../../hooks/useAppContext';
import { cx } from 'class-variance-authority';

interface AddPageProps {
  index: number;
  at: number;
}

export default function AddPage({ index, at }: AddPageProps) {
  const { setPages, setHighlightedPageId } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showWithDelay = useCallback((delay: number = 0) => {
    // Clear previous timeout if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (delay > 0) {
      // Apply setIsVisible after delay to prevent flickering when moving between buttons
      timeoutRef.current = window.setTimeout(() => {
        setIsVisible(true);
        timeoutRef.current = null;
      }, delay);
    } else {
      // Apply immediately for focus events
      setIsVisible(true);
    }
  }, []);

  const hideWithDelay = useCallback((delay: number = 0) => {
    // Clear timeout when leaving hover/focus
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (delay > 0) {
      // Hide after delay, allowing user to return without flickering
      timeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
        timeoutRef.current = null;
      }, delay);
    } else {
      // Hide immediately for blur events
      setIsVisible(false);
    }
  }, []);

  const handleAddPage = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      // Prevent multiple submissions and remove focus
      e.currentTarget.blur();

      // Hide the button immediately to avoid flicker after the page has been added
      setIsVisible(false);

      // Generate a unique ID using crypto API if available, fallback to timestamp + random
      const id = crypto?.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      setPages((prevPages) => {
        const newPage = { id, label: 'New Page' };

        // Insert newPage after the index 'at'
        return [
          ...prevPages.slice(0, at + 1), // Elements from 0 to at (inclusive)
          newPage, // New page
          ...prevPages.slice(at + 1), // Elements from at+1 to end
        ];
      });

      // Use setTimeout to ensure the page is added to DOM before highlighting
      setTimeout(() => {
        setHighlightedPageId(id);
      }, 0);
    },
    [at, setPages, setHighlightedPageId]
  );

  return (
    <div
      style={
        {
          '--index': index,
        } as React.CSSProperties
      }
      className={cx(
        'relative flex items-center justify-center px-2.5',
        'transition-[width] duration-500 ease-out',
        // Use conditional classes for visibility
        'group',
        isVisible ? 'w-14' : 'w-0'
      )}
      onMouseEnter={() => showWithDelay(300)}
      onMouseLeave={() => hideWithDelay(100)}
      // Add ARIA label for better accessibility
      aria-label='Insert new page'
    >
      <div className='flex items-center justify-center'>
        <button
          onClick={handleAddPage}
          onFocus={() => showWithDelay()}
          onBlur={() => hideWithDelay()}
          className={cx(
            // Base styles
            'w-4 h-4 rounded-full bg-white',
            'border border-[rgb(225,225,225)]',
            // Interactive states with original colors
            'hover:border-[rgb(217,220,225)] hover:text-[rgb(47,114,226)]',
            'focus:outline-none focus:border-[rgb(47,114,226)] focus:ring-2 focus:ring-blue-500/20',
            // Transform animations - using conditional classes
            'transition-transform duration-300 ease-out',
            isVisible ? 'scale-110' : 'scale-0',
            // Ensure proper z-index for interactions
            'relative z-10'
          )}
          // Accessibility improvements
          aria-label={`Add new page after position ${at + 1}`}
          tabIndex={0}
          type='button'
        >
          <span className='flex items-center justify-center'>
            <Plus className='w-2.5 h-2.5' />
          </span>
        </button>
      </div>
    </div>
  );
}
