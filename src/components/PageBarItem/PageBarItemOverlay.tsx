import { type ReactNode } from 'react';
import PageBarItemBase from './PageBarItemBase';
import type { UniqueIdentifier } from '@dnd-kit/core';

interface Props {
  children: ReactNode;
  id: UniqueIdentifier;
}

// TODO: Use a better name maybe?
export default function PageBarItemOverlay({ children, id }: Props) {
  return <PageBarItemBase id={id}>{children}</PageBarItemBase>;
}
