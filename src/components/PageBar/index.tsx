import type { ComponentProps, ReactElement } from 'react';
import type PageBarItem from '../PageBarItem';

interface Props {
  children: ReactElement<ComponentProps<typeof PageBarItem>>[];
}

export default function PageBar({ children }: Props) {
  return <div>{children}</div>;
}
