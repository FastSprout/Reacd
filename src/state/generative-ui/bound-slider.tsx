import { useMemo } from 'react';
import type { z } from 'zod';
import { Slider } from '../../components/slider/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { sliderNodeSchema } from '../../schema/slider/index.js';
import { sliderNumberSchema, sliderRangeSchema } from '../../schema/slider/index.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

type SliderNode = z.infer<typeof sliderNodeSchema>;
interface BoundSliderProps {
  readonly node: SliderNode;
  readonly registry: StateRegistry;
}

function BoundSingle({ node, registry }: BoundSliderProps) {
  const target = useMemo(
    () => ({ kinds: ['number'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(
    () => sliderNumberSchema({ min: node.min, max: node.max }),
    [node.min, node.max],
  );
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, mode: _mode, readOnly, ...properties } = node;
  return (
    <Slider
      {...properties}
      value={result.data.value}
      onValueChange={result.data.write}
      readOnly={readOnly || node.value.mode === 'read'}
    />
  );
}

function BoundRange({ node, registry }: BoundSliderProps) {
  const target = useMemo(
    () => ({ kinds: ['numberRange'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(
    () => sliderRangeSchema({ min: node.min, max: node.max }),
    [node.min, node.max],
  );
  const result = useBoundValue(registry, node.value, target, schema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, mode: _mode, readOnly, ...properties } = node;
  return (
    <Slider
      {...properties}
      mode="range"
      value={result.data.value}
      onValueChange={result.data.write}
      readOnly={readOnly || node.value.mode === 'read'}
    />
  );
}

export function BoundSlider(properties: BoundSliderProps) {
  return properties.node.mode === 'range' ? (
    <BoundRange {...properties} />
  ) : (
    <BoundSingle {...properties} />
  );
}
