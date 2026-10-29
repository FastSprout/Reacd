import { useMemo } from 'react';
import { SelectMenu } from '../../components/select-menu/index.js';
import type { SelectMenuProps } from '../../components/select-menu/index.js';
import type { SelectMenuNode } from '../../schema/select-menu/index.js';
import { menuTextSchema } from '../../schema/form-menu-shared/text.schema.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

interface ChannelProps {
  node: SelectMenuNode;
  registry: StateRegistry;
  properties: SelectMenuProps;
}

const OPEN_TARGET = { kinds: ['boolean'], mode: 'readWrite' } as const;

function BoundOpen({
  reference,
  registry,
  properties,
}: ChannelProps & {
  reference: NonNullable<SelectMenuNode['open']>;
}) {
  const result = useBoundValue(registry, reference, OPEN_TARGET, booleanValueSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <SelectMenu
      {...properties}
      open={result.data.value}
      onOpenChange={(next) => result.data.write(next).success}
    />
  );
}

function Disclosure(properties: ChannelProps) {
  return properties.node.open === undefined ? (
    <SelectMenu {...properties.properties} />
  ) : (
    <BoundOpen {...properties} reference={properties.node.open} />
  );
}

function BoundQuery({
  node,
  registry,
  properties,
  reference,
}: ChannelProps & {
  reference: NonNullable<SelectMenuNode['query']>;
}) {
  const target = useMemo(
    () => ({ kinds: ['text'] as const, mode: reference.mode }),
    [reference.mode],
  );
  const result = useBoundValue(registry, reference, target, menuTextSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <Disclosure
      node={node}
      registry={registry}
      properties={{
        ...properties,
        query: result.data.value,
        onQueryChange: (next) => result.data.write(next).success,
        queryReadOnly: properties.queryReadOnly || reference.mode === 'read',
      }}
    />
  );
}

export function BoundSelectMenuChannels(properties: ChannelProps) {
  return properties.node.query === undefined ? (
    <Disclosure {...properties} />
  ) : (
    <BoundQuery {...properties} reference={properties.node.query} />
  );
}
