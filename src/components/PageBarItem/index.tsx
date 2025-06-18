import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

// just a facade of the real bar item component which will be generated dynamically
export default function PageBarItem({ children }: Props) {
  return children;
}
