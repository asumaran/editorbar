import { type ReactNode } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';
import PageBarItem from '.';

interface Props {
  children: ReactNode;
  id: UniqueIdentifier;
}

// TODO: Use a better name maybe?
export default function PageBarItemOverlay({ children, id }: Props) {
  return <PageBarItem id={id}>{children}</PageBarItem>;
}
