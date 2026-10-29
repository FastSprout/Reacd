import { useMemo } from 'react';
import type { z } from 'zod';
import { InputTime } from '../../components/input-time/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import {
  boundedTimeValueSchema,
  timeRangeValueSchema,
} from '../../schema/date-time/index.js';
import type { inputTimeNodeSchema } from '../../schema/input-time/index.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

type TimeNode = z.infer<typeof inputTimeNodeSchema>;
type SingleTimeNode = Omit<TimeNode, 'mode'> & { mode?: 'single' | undefined };
type RangeTimeNode = Omit<TimeNode, 'mode'> & { mode: 'range' };

function BoundSingleTime({
  node,
  registry,
}: {
  node: SingleTimeNode;
  registry: StateRegistry;
}) {
  const target = useMemo(
    () => ({ kinds: ['time'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(
    () => boundedTimeValueSchema({ min: node.min, max: node.max }),
    [node.min, node.max],
  );
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, readOnly, ...properties } = node;
  return (
    <InputTime
      {...properties}
      value={result.data.value}
      onValueChange={result.data.write}
      readOnly={readOnly || node.value.mode === 'read'}
    />
  );
}

function BoundRangeTime({
  node,
  registry,
}: {
  node: RangeTimeNode;
  registry: StateRegistry;
}) {
  const target = useMemo(
    () => ({ kinds: ['timeRange'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(
    () => timeRangeValueSchema({ min: node.min, max: node.max }),
    [node.min, node.max],
  );
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, readOnly, ...properties } = node;
  return (
    <InputTime
      {...properties}
      value={result.data.value}
      onValueChange={result.data.write}
      readOnly={readOnly || node.value.mode === 'read'}
    />
  );
}

export function BoundInputTime({
  node,
  registry,
}: {
  node: TimeNode;
  registry: StateRegistry;
}) {
  return node.mode === 'range' ? (
    <BoundRangeTime node={{ ...node, mode: 'range' }} registry={registry} />
  ) : (
    <BoundSingleTime node={{ ...node, mode: 'single' }} registry={registry} />
  );
}
