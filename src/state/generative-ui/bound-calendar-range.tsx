import { useMemo } from 'react';
import { Calendar } from '../../components/calendar/index.js';
import type { CalendarNodeDeclaration } from '../../schema/calendar/index.js';
import { dateRangeValueSchema } from '../../schema/date-time/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

export function BoundCalendarRange({
  node,
  registry,
}: {
  node: CalendarNodeDeclaration;
  registry: StateRegistry;
}) {
  const target = useMemo(
    () => ({ kinds: ['dateRange'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(
    () => dateRangeValueSchema({ min: node.min, max: node.max }),
    [node.min, node.max],
  );
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, mode: _mode, readOnly, ...properties } = node;
  return (
    <Calendar
      {...properties}
      mode="range"
      value={result.data.value}
      onValueChange={result.data.write}
      readOnly={readOnly || node.value.mode === 'read'}
    />
  );
}
