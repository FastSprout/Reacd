import { Timeline } from '../../components/timeline/timeline.js';
import type { TimelineProps } from '../../components/timeline/timeline.js';
import { timelineValueSchema } from '../../schema/timeline/value.schema.js';
import type { StateBindingReference } from '../../schema/state/binding.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { useBoundValue } from './use-bound-value.js';

const TARGET = { kinds: ['text'], mode: 'readWrite' } as const;
export function BoundTimeline({
  reference,
  properties,
  registry,
}: {
  reference: StateBindingReference;
  properties: Omit<TimelineProps, 'value' | 'onValueChange'>;
  registry: StateRegistry;
}) {
  const result = useBoundValue(
    registry,
    reference,
    TARGET,
    timelineValueSchema(properties.items),
  );
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <Timeline
      {...properties}
      value={result.data.value}
      onValueChange={result.data.write}
    />
  );
}
