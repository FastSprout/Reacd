import type { InputMenuProps } from '../../components/input-menu/index.js';
import { InputMenu } from '../../components/input-menu/index.js';
import type { z } from 'zod';
import type { writeStateBindingSchema } from '../../schema/state/binding.schema.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

const TARGET = { kinds: ['boolean'], mode: 'readWrite' } as const;

export function BoundInputMenuOpen({
  properties,
  reference,
  registry,
}: {
  properties: InputMenuProps;
  reference: z.infer<typeof writeStateBindingSchema>;
  registry: StateRegistry;
}) {
  const result = useBoundValue(registry, reference, TARGET, booleanValueSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <InputMenu
      {...properties}
      open={result.data.value}
      onOpenChange={(next) => result.data.write(next).success}
    />
  );
}
