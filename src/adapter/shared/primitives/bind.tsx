import type { ComponentType } from 'react';
import type { AdapterPrimitives } from './contract.js';
import { PrimitiveScope } from './scope.js';

export function bindPrimitives<Properties extends object>(
  Component: ComponentType<Properties>,
  primitives: AdapterPrimitives,
  displayName: string,
): ComponentType<Properties> {
  function BoundAdapter(properties: Properties) {
    return (
      <PrimitiveScope primitives={primitives}>
        <Component {...properties} />
      </PrimitiveScope>
    );
  }
  BoundAdapter.displayName = displayName;
  return BoundAdapter;
}
