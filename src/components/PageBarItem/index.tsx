import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function PageBarItem({ children }: Props) {
  return <div>{children}</div>;
}
