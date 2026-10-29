import type { ReactNode } from 'react';
import { Header } from '../../components/header/header.js';
import type { HeaderProps } from '../../components/header/header.js';
import type { HeaderNode } from '../../schema/header/generative.schema.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

const TARGET = { kinds: ['boolean'], mode: 'readWrite' } as const;

export function BoundHeader({
  properties,
  menu,
  content,
  registry,
}: {
  properties: Omit<HeaderProps, 'menu'>;
  menu: NonNullable<HeaderNode<GenerativeNode>['menu']>;
  content: ReactNode;
  registry: StateRegistry;
}) {
  const result = useBoundValue(registry, menu.open, TARGET, booleanValueSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <Header
      {...properties}
      menu={{
        mode: menu.mode,
        toggleLabel: menu.toggleLabel,
        closeLabel: menu.closeLabel,
        content,
        open: result.data.value,
        onOpenChange: result.data.write,
      }}
    />
  );
}
