import { useContext } from 'react';
import type { AdapterPrimitives } from './contract.js';
import { PrimitiveContext, PRIMITIVE_SCOPE_ERROR } from './context-value.js';

export function usePrimitives(): AdapterPrimitives {
  const primitives = useContext(PrimitiveContext);
  if (primitives === null) throw new Error(PRIMITIVE_SCOPE_ERROR);
  return primitives;
}
