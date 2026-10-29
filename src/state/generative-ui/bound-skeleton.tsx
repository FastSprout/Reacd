import { Skeleton } from '../../components/skeleton/skeleton.js';
import type { SkeletonProps } from '../../components/skeleton/skeleton.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import type { StateBindingReference } from '../../schema/state/binding.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { useBoundValue } from './use-bound-value.js';
const TARGET = { kinds: ['boolean'], mode: 'read' } as const;
export function BoundSkeleton({
  reference,
  properties,
  registry,
}: {
  reference: StateBindingReference;
  properties: Omit<SkeletonProps, 'show'>;
  registry: StateRegistry;
}) {
  const result = useBoundValue(registry, reference, TARGET, booleanValueSchema);
  return result.success ? (
    <Skeleton {...properties} show={result.data.value} />
  ) : (
    <Issues issues={result.issues} />
  );
}
