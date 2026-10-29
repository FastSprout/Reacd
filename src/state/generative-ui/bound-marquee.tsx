import { useMemo } from 'react';
import { z } from 'zod';
import { Marquee } from '../../components/marquee/index.js';
import type { marqueeNodeSchema } from '../../schema/marquee/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';
const VALUE = z.boolean();
export function BoundMarquee({
  node,
  registry,
}: {
  node: z.infer<typeof marqueeNodeSchema>;
  registry: StateRegistry;
}) {
  const target = useMemo(
    () => ({ kinds: ['boolean'] as const, mode: node.paused.mode }),
    [node.paused.mode],
  );
  const result = useBoundValue(registry, node.paused, target, VALUE);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, paused: _paused, readOnly, ...properties } = node;
  return (
    <Marquee
      {...properties}
      paused={result.data.value}
      onPausedChange={result.data.write}
      readOnly={readOnly || node.paused.mode === 'read'}
    />
  );
}
