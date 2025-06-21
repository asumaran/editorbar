import { cva, cx, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

const buttonVariants = cva(
  'px-2.5 h-8 border rounded-lg transition-colors focus:outline-none focus:border-[rgb(47,114,226)] focus:ring-2 focus:ring-blue-500/20 focus:bg-white active:ring-0 bg-clip-padding',
  {
    variants: {
      variant: {
        default:
          'bg-[rgb(235,237,240)] border-[rgb(235,237,240)] text-[rgb(103,114,137)] focus:text-[rgb(26,26,26)] hover:bg-[rgb(217,220,225)] hover:border hover:border-[rgb(217,220,225)] active:text-[rgb(26,26,26)] active:border active:border-[rgb(225,225,225)] active:bg-white active:shadow-xs',
        light:
          'bg-white border-[rgb(225,225,255)] text-[rgb(26,26,26)] hover:text-[rgb(47,114,226)] shadow-xs',
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

export default function Button({
  className,
  variant,
  children,
  ...props
}: ButtonProps & ComponentProps<'button'>) {
  return (
    <button className={cx(buttonVariants({ variant, className }))} {...props}>
      <span className='flex items-center gap-1.5 text-nowrap h-full'>
        {children}
      </span>
    </button>
  );
}
