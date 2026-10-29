import { Progress } from '../../components/progress/progress.js';
import type { ProgressProps } from '../../components/progress/progress.props.js';
import { useMemo } from 'react';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { boundedProgressValueSchema } from '../../schema/progress/progress.schema.js';
import type { StateBindingReference } from '../../schema/state/binding.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

const TARGET = { kinds: ['number', 'nullableNumber'], mode: 'read' } as const;

export function BoundProgress({
  reference,
  label,
  registry,
  ...properties
}: Omit<ProgressProps, 'value'> & {
  reference: StateBindingReference;
  registry: StateRegistry;
}) {
  const schema = useMemo(
    () => boundedProgressValueSchema(properties.max),
    [properties.max],
  );
  const result = useBoundValue(registry, reference, TARGET, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  return <Progress {...properties} label={label} value={result.data.value} />;
}
