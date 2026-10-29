import { Banner } from '../../components/banner/banner.js';
import type { BannerProps } from '../../components/banner/banner.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import type { StateBindingReference } from '../../schema/state/binding.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { useBoundValue } from './use-bound-value.js';

const TARGET = { kinds: ['boolean'], mode: 'readWrite' } as const;
export function BoundBanner({
  reference,
  properties,
  registry,
}: {
  reference: StateBindingReference;
  properties: Omit<BannerProps, 'open' | 'onOpenChange'>;
  registry: StateRegistry;
}) {
  const result = useBoundValue(registry, reference, TARGET, booleanValueSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <Banner {...properties} open={result.data.value} onOpenChange={result.data.write} />
  );
}
