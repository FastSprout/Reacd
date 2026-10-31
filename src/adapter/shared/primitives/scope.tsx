import { useContext } from 'react';
import type { ReactNode } from 'react';
import type { AdapterPrimitives } from './contract.js';
import { PrimitiveContext } from './context-value.js';

export interface PrimitiveScopeProps {
  primitives: AdapterPrimitives;
  children?: ReactNode;
}

export function PrimitiveScope({ primitives, children }: PrimitiveScopeProps) {
  const inherited = useContext(PrimitiveContext);
  if (inherited === primitives) return children;
  return <PrimitiveContext value={primitives}>{children}</PrimitiveContext>;
}
