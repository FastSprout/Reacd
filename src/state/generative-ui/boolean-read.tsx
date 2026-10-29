import type { ReactNode } from 'react';
import type { StateBindingReference } from '../../schema/state/binding.schema.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { useBoundValue } from './use-bound-value.js';

const TARGET = { kinds: ['boolean'], mode: 'read' } as const;
interface BooleanReadProps {
  value: boolean | StateBindingReference | undefined;
  fallback: boolean;
  registry: StateRegistry;
  children: (value: boolean) => ReactNode;
}

function BoundBooleanRead({
  reference,
  registry,
  children,
}: Omit<BooleanReadProps, 'value' | 'fallback'> & {
  reference: StateBindingReference;
}) {
  const result = useBoundValue(registry, reference, TARGET, booleanValueSchema);
  return result.success ? (
    children(result.data.value)
  ) : (
    <Issues issues={result.issues} />
  );
}

export function BooleanRead({ value, fallback, registry, children }: BooleanReadProps) {
  return typeof value === 'object' ? (
    <BoundBooleanRead reference={value} registry={registry}>
      {children}
    </BoundBooleanRead>
  ) : (
    children(value ?? fallback)
  );
}
