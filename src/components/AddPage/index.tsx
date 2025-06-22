import { Plus } from 'lucide-react';
import { useRef, useState } from 'react';
import useAppContext from '../../hooks/useAppContext';
import { cx } from 'class-variance-authority';

export default function AddPage({ at }: { at: number }) {
  const { setPages } = useAppContext();
  const parentRef = useRef<HTMLDivElement>(null);
  const [isHovered, setHovered] = useState(false); // Controls visibility
  const [hiding, setHiding] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const showWithDelay = (delay: number = 0) => {
    // Clear previous timeout if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (delay > 0) {
      // Apply setHovered after delay to prevent flickering when moving between buttons
      timeoutRef.current = setTimeout(() => {
        setHovered(true);
        setHiding(false);
      }, delay);
    } else {
      // Apply immediately for focus events
      setHovered(true);
      setHiding(false);
    }
  };

  const hideWithDelay = (delay: number = 0) => {
    // Clear timeout when leaving hover/focus
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (delay > 0) {
      // Hide after delay, allowing user to return without flickering
      timeoutRef.current = setTimeout(() => {
        setHovered(false);
        setHiding(true);
      }, delay);
    } else {
      // Hide immediately for blur events
      setHovered(false);
      setHiding(true);
    }
  };

  return (
    <div
      className={cx(
        'flex items-center justify-center group px-2.5 transition-[width] duration-500 ease-out  ',
        isHovered ? ' onHover w-[56px]' : 'w-0',
        hiding ? ' onHide ' : 'w-0'
      )}
      ref={parentRef}
      onMouseEnter={() => showWithDelay(300)}
      onMouseLeave={() => hideWithDelay(100)}
    >
      <div className='flex items-center justify-center'>
        <button
          onClick={handleOnClick}
          onFocus={() => showWithDelay()}
          onBlur={() => hideWithDelay()}
          className='border border-[rgb(225,225,225)] hover:border-[rgb(217,220,225)] hover:text-[rgb(47,114,226)] bg-white rounded-full w-4 h-4 scale-0 group-[.onHover]:scale-120 transition-transform duration-300 ease-out focus:outline-none focus:border-[rgb(47,114,226)] focus:ring-2 focus:ring-blue-500/20'
        >
          <span className='flex items-center justify-center'>
            <Plus className='w-2.5 h-2.5' />
          </span>
        </button>
      </div>
    </div>
  );

  function handleOnClick() {
    // Remove immediately to avoid flicker after the page has been added
    setHovered(false);
    setHiding(true);

    setPages((p) => {
      const id = Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
      const newPage = { id: id, label: 'Other' };

      // Insert newPage after the index 'at'
      return [
        ...p.slice(0, at + 1), // Elements from 0 to at (inclusive)
        newPage, // New page
        ...p.slice(at + 1), // Elements from at+1 to end
      ];
    });
  }
}
