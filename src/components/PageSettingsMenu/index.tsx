import classNames from 'classnames';
import { Flag, Pencil, Trash, CopyIcon, Clipboard } from 'lucide-react';
import type { ReactNode } from 'react';

export default function PageSettingsMenu() {
  return (
    <div className='w-50 rounded-xl border overflow-hidden border-gray-200 bg-white shadow-xs'>
      <div className='bg-[#FAFBFC]'>
        <h3 className='p-[12px] font-[BL_Melody]  text-[16px]/[1] font-medium border-b-gray-200 border-b-1 text-gray-800'>
          Settings
        </h3>
      </div>
      <div className='space-y-1 p-1 '>
        <PageSettingsMenuItem
          icon={<Flag className='h-4 w-4 text-blue-500' />}
          label='Set as first page'
        />
        <PageSettingsMenuItem
          icon={<Pencil className='h-4 w-4 text-gray-500' />}
          label='Rename'
        />
        <PageSettingsMenuItem
          icon={<Clipboard className='h-4 w-4 text-gray-500' />}
          label='Copy'
        />
        <PageSettingsMenuItem
          icon={<CopyIcon className='h-4 w-4 text-gray-500' />}
          label='Duplicate'
        />
        <PageSettingsMenuSeparator />
        <PageSettingsMenuItem
          icon={<Trash className='h-4 w-4' />}
          label='Delete'
          color='red'
        />
      </div>
    </div>
  );
}

function PageSettingsMenuSeparator() {
  return <hr className='my-1 border-t border-gray-200 mx-2' />;
}

function PageSettingsMenuItem({
  icon,
  label,
  color = 'gray',
}: {
  icon: ReactNode;
  label: string;
  color?: 'gray' | 'red';
}) {
  return (
    <div
      className={classNames(
        'rounded-md px-2.5 py-1 text-sm font-medium select-none will-change-auto',
        color === 'gray'
          ? 'text-gray-700 hover:bg-gray-100 active:bg-gray-200' // Regular
          : 'text-red-600 hover:bg-red-50 active:bg-red-200' // Delete
      )}
    >
      <div className='flex gap-1.5 items-center'>
        {icon}
        {label}
      </div>
    </div>
  );
}
