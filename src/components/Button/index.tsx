import { cva, cx, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

const buttonVariants = cva(
  // Base button styles
  [
    'select-none px-2.5 h-8 border rounded-lg',
    'transition-colors bg-clip-padding',
    'focus:outline-none focus:border-[rgb(47,114,226)] focus:ring-2 focus:ring-blue-500/20 focus:bg-white',
    'active:ring-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          // Base state
          'bg-[rgb(235,237,240)] border-[rgb(235,237,240)] text-[rgb(103,114,137)]',
          // Focus state
          'focus:text-[rgb(26,26,26)]',
          // Hover state
          'hover:bg-[rgb(217,220,225)] hover:border hover:border-[rgb(217,220,225)]',
          // Active state
          'active:text-[rgb(26,26,26)] active:border active:border-[rgb(225,225,225)] active:bg-white active:shadow-xs',
        ].join(' '),
        light: [
          'bg-white border-[rgb(225,225,255)] text-[rgb(26,26,26)]',
          'hover:text-[rgb(47,114,226)]',
          'shadow-xs',
        ].join(' '),
        active: [
          'text-[rgb(26,26,26)] border border-[rgb(225,225,225)]',
          'bg-white shadow-xs',
        ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

type ButtonComponentProps = ButtonProps & ComponentProps<'button'>;

export default function Button({
  className,
  variant,
  children,
  ...props
}: ButtonComponentProps) {
  return (
    <button className={cx(buttonVariants({ variant, className }))} {...props}>
      <span className='flex items-center gap-1.5 text-nowrap h-full'>
        {children}
      </span>
    </button>
  );
}
