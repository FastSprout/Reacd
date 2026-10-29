import { Empty } from '../../components/empty/empty.js';
import type { EmptyProps } from '../../components/empty/empty.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import type { StateBindingReference } from '../../schema/state/binding.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { useBoundValue } from './use-bound-value.js';
const TARGET = { kinds: ['boolean'], mode: 'read' } as const;
export function BoundEmpty({
  reference,
  properties,
  registry,
}: {
  reference: StateBindingReference;
  properties: Omit<EmptyProps, 'loading'>;
  registry: StateRegistry;
}) {
  const result = useBoundValue(registry, reference, TARGET, booleanValueSchema);
  return result.success ? (
    <Empty {...properties} loading={result.data.value} />
  ) : (
    <Issues issues={result.issues} />
  );
}
