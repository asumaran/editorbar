import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

const dropdownItemVariants = cva(
  'relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-2 [&>svg]:w-4 [&>svg]:h-4 text-black hover:text-black focus:bg-gray-100 [&>svg]:hover:text-black [&>svg]:text-gray-600',
  {
    variants: {
      variant: {
        default: '',
        danger: 'text-red-700 focus:bg-red-50 [&>svg]:text-red-700',
      },
    },
  }
);

interface Props extends VariantProps<typeof dropdownItemVariants> {
  children: ReactNode;
}

export default function DropdownItem({
  children,
  variant,
  className,
  ...props
}: Props & ComponentProps<typeof DropdownMenu.Item>) {
  return (
    <DropdownMenu.Item
      {...props}
      className={cx(dropdownItemVariants({ variant, className }))}
    >
      {children}
    </DropdownMenu.Item>
  );
}
