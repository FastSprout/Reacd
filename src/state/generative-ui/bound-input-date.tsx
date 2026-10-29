import { useMemo } from 'react';
import type { z } from 'zod';
import { InputDate } from '../../components/input-date/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import {
  boundedDateValueSchema,
  dateRangeValueSchema,
} from '../../schema/date-time/index.js';
import type { inputDateNodeSchema } from '../../schema/input-date/index.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

type DateNode = z.infer<typeof inputDateNodeSchema>;
type SingleDateNode = Omit<DateNode, 'mode'> & { mode?: 'single' | undefined };
type RangeDateNode = Omit<DateNode, 'mode'> & { mode: 'range' };

function BoundSingleDate({
  node,
  registry,
}: {
  node: SingleDateNode;
  registry: StateRegistry;
}) {
  const target = useMemo(
    () => ({ kinds: ['date'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(
    () => boundedDateValueSchema({ min: node.min, max: node.max }),
    [node.min, node.max],
  );
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, readOnly, ...properties } = node;
  return (
    <InputDate
      {...properties}
      value={result.data.value}
      onValueChange={result.data.write}
      readOnly={readOnly || node.value.mode === 'read'}
    />
  );
}

function BoundRangeDate({
  node,
  registry,
}: {
  node: RangeDateNode;
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
  const { type: _type, value: _value, readOnly, ...properties } = node;
  return (
    <InputDate
      {...properties}
      value={result.data.value}
      onValueChange={result.data.write}
      readOnly={readOnly || node.value.mode === 'read'}
    />
  );
}

export function BoundInputDate({
  node,
  registry,
}: {
  node: DateNode;
  registry: StateRegistry;
}) {
  return node.mode === 'range' ? (
    <BoundRangeDate node={{ ...node, mode: 'range' }} registry={registry} />
  ) : (
    <BoundSingleDate node={{ ...node, mode: 'single' }} registry={registry} />
  );
}
