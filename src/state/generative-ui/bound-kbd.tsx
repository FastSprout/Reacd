import { Kbd } from '../../components/kbd/kbd.js';
import type { KbdProps } from '../../components/kbd/kbd.js';
import { kbdSchema } from '../../schema/kbd/kbd.schema.js';
import type { StateBindingReference } from '../../schema/state/binding.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { useBoundValue } from './use-bound-value.js';
const TARGET = { kinds: ['text'], mode: 'read' } as const;
export function BoundKbd({
  reference,
  properties,
  registry,
}: {
  reference: StateBindingReference;
  properties: Omit<KbdProps, 'value'>;
  registry: StateRegistry;
}) {
  const result = useBoundValue(registry, reference, TARGET, kbdSchema.shape.value);
  return result.success ? (
    <Kbd {...properties} value={result.data.value} />
  ) : (
    <Issues issues={result.issues} />
  );
}
