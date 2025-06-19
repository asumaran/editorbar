import classNames from 'classnames';
import { Flag, Pencil, Trash, CopyIcon, Clipboard } from 'lucide-react';
import type { ReactNode } from 'react';

export default function PageSettingsMenu() {
  return (
    <div className='w-64 rounded-xl border overflow-hidden border-gray-200 bg-white shadow-md'>
      <h3 className='p-[12px] bg-gray-50  font-[BL_Melody] text-[16px] font-semibold border-b-gray-200 border-b-1 text-gray-800'>
        Settings
      </h3>

      <ul className='space-y-1'>
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
      </ul>
    </div>
  );
}

function PageSettingsMenuSeparator() {
  return <hr className='my-2 border-t border-gray-200' />;
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
        'flex cursor-pointer px-[12px] items-center gap-2 py-[7px] text-sm font-medium transition-colors duration-300 ease-in-out select-none',
        color === 'gray'
          ? 'text-gray-700 hover:bg-gray-100 active:bg-gray-300'
          : 'text-red-600 hover:bg-red-50 active:bg-red-200'
      )}
    >
      {icon}
      {label}
    </div>
  );
}
