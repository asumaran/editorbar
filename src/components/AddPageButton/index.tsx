import { Plus } from 'lucide-react';
import Button from '../Button';

export default function AddPageButton({
  variant,
  onClick,
}: {
  variant?: 'default' | 'light';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <div>
      <Button
        onClick={onClick}
        variant={variant}
        icon={<Plus className='w-4 h-4' />}
      >
        Add page
      </Button>
    </div>
  );
}
