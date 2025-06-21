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
  console.log(
    cx(
      'flex items-center group px-2.5',
      isHovered ? ' onHover px-5' : '',
      hiding ? ' onHide ' : ''
    )
  );
  return (
    <div
      className={cx(
        'flex items-center group px-2.5',
        isHovered ? ' onHover px-5' : '',
        hiding ? ' onHide ' : ''
      )}
      ref={parentRef}
      onMouseEnter={() => {
        // Clear previous timeout if it exists
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        // Apply setHovered after 300ms to prevent flickering when moving between buttons
        timeoutRef.current = setTimeout(() => {
          setHovered(true);
          setHiding(false);
        }, 300);
      }}
      onMouseLeave={() => {
        // Clear timeout when leaving hover
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        // Hide after 300ms delay, allowing user to return without flickering
        timeoutRef.current = setTimeout(() => {
          setHovered(false);
          setHiding(true);
        }, 300);
      }}
    >
      <div className='hidden group-[.onHover]:block'>
        <button
          onClick={handleOnClick}
          className='border border-[rgb(225,225,225)] hover:border-[rgb(217,220,225)] hover:text-[rgb(47,114,226)] bg-white rounded-full w-4 h-4'
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
