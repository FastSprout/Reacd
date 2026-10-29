import type { ReactNode } from 'react';
import type { StateBindingReference } from '../../schema/state/binding.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { useBoundValue } from './use-bound-value.js';
import type { ReadValueProps } from './read-value.props.js';

export function BoundReadValue<Value>({
  registry,
  reference,
  kinds,
  schema,
  children,
}: ReadValueProps<Value> & { reference: StateBindingReference }): ReactNode {
  const result = useBoundValue(registry, reference, { kinds, mode: 'read' }, schema);
  return result.success ? (
    children(result.data.value)
  ) : (
    <Issues issues={result.issues} />
  );
}
