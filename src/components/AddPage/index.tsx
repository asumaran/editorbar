import { Plus } from 'lucide-react';
import { useRef, useState, useEffect, type MouseEvent } from 'react';
import useAppContext from '../../hooks/useAppContext';
import { cx } from 'class-variance-authority';

interface AddPageProps {
  index: number;
  at: number;
}

export default function AddPage({ index, at }: AddPageProps) {
  const { addPage } = useAppContext();
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

  function showWithDelay(delay: number = 0) {
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
  }

  function hideWithDelay(delay: number = 0) {
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
  }

  function handleAddPage(e: MouseEvent<HTMLButtonElement>) {
    // Prevent multiple submissions and remove focus
    e.currentTarget.blur();

    // Hide the button immediately to avoid flicker after the page has been added
    setIsVisible(false);

    // Add new page using the context action
    // The addPage function will handle ID generation, insertion at position 'at', and highlighting
    addPage('New Page', at);
  }

  return (
    <div
      style={
        {
          '--index': index,
        } as React.CSSProperties
      }
      className={cx(
        // Layout
        'relative flex items-center justify-center px-2.5',
        // Animations and transitions
        'transition-[width] duration-500 ease-out',
        // Conditional width for visibility
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
            // Layout and base styles
            'w-4 h-4 rounded-full',
            // Colors and borders
            'bg-white border border-[rgb(225,225,225)]',
            // Interactive states
            'hover:border-[rgb(217,220,225)] hover:text-[rgb(47,114,226)]',
            'focus:outline-none focus:border-[rgb(47,114,226)] focus:ring-2 focus:ring-blue-500/20',
            // Animations and transforms
            'transition-transform duration-300 ease-out',
            // Conditional scaling based on visibility
            isVisible ? 'scale-110' : 'scale-0',
            // Z-index for proper layering
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
