import classNames from 'classnames';
import { Plus } from 'lucide-react';
import { useRef, useState } from 'react';

export default function AddPage() {
  const parentRef = useRef<HTMLDivElement>(null);
  const [isHovered, setHovered] = useState(false); // Controls visibility
  const [hiding, setHiding] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  return (
    <div
      className={classNames(
        'flex items-center group px-2.5',
        isHovered ? ' onHover ' : '',
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
          className='border border-[#E1E1E1] rounded-full w-4 h-4'
        >
          <span className='flex items-center justify-center'>
            <Plus className='w-2.5 h-2.5' />
          </span>
        </button>
      </div>
    </div>
  );

  function handleOnClick() {
    console.log('Add Page click');
  }
}
