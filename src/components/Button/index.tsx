import { cva, cx, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

const buttonVariants = cva(
  'border px-2.5 h-8 rounded-lg transition-colors focus:outline-none focus:border-[rgb(47,114,226)] focus:ring-2 focus:ring-blue-500/20 focus:bg-white active:ring-0 active:border-[rgb(225,225,225)]',
  {
    variants: {
      variant: {
        default:
          'bg-[rgb(235,237,240)] border-[rgb(235,237,240)] hover:bg-[rgb(217,220,225)] hover:border-[rgb(217,220,225)] active:bg-white active:shadow-xs',
        light:
          'bg-white border-[#E1E1E1] color-[#1A1A1A] hover:text-[rgb(47,114,226)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  icon?: ReactNode;
  children: ReactNode;
}

export default function Button({
  icon,
  variant,
  children,
  ...props
}: ButtonProps & ComponentProps<'button'>) {
  return (
    <button className={cx(buttonVariants({ variant }))} {...props}>
      <span className='flex items-center gap-2'>
        {icon && (
          <span className='h-4 w-4 flex items-center justify-center'>
            {icon}
          </span>
        )}
        <span className='whitespace-nowrap'>{children}</span>
      </span>
    </button>
  );
}
