import { useMemo } from 'react';
import type { z } from 'zod';
import { LocaleSelect } from '../../components/locale-select/index.js';
import {
  localeValueSchema,
  type localeSelectNodeSchema,
} from '../../schema/locale-select/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

export function BoundLocaleSelect({
  node,
  registry,
}: {
  node: z.infer<typeof localeSelectNodeSchema>;
  registry: StateRegistry;
}) {
  const target = useMemo(
    () => ({
      kinds: ['text'] as const,
      mode: node.value.mode,
    }),
    [node.value.mode],
  );
  const schema = useMemo(() => localeValueSchema(node.locales), [node.locales]);
  const value = useBoundValue(registry, node.value, target, schema);
  if (!value.success) return <Issues issues={value.issues} />;
  const { type: _type, value: reference, readOnly, ...properties } = node;
  return (
    <LocaleSelect
      {...properties}
      value={value.data.value}
      onValueChange={value.data.write}
      readOnly={readOnly || reference.mode === 'read'}
    />
  );
}
