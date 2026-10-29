import type { z } from 'zod';
import { resolvedColorModeSchema } from '../../schema/color-mode/color-mode.schema.js';
import type {
  ColorModeControlNode,
  ColorModeAssetNode,
} from '../../schema/color-mode/generative.types.js';
import type { ResolvedColorMode } from '../../core/color-mode-policy.js';
import type { readStateBindingSchema } from '../../schema/state/binding.schema.js';
import { ColorModeAvatar } from '../../components/color-mode-avatar/index.js';
import { ColorModeImage } from '../../components/color-mode-image/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';
import { BoundColorModeControl } from './color-mode-control.js';

const TARGET = { kinds: ['text'], mode: 'read' } as const;

export function BoundColorModeSystem({
  node,
  reference,
  registry,
}: {
  node: ColorModeControlNode;
  reference: z.infer<typeof readStateBindingSchema>;
  registry: StateRegistry;
}) {
  const result = useBoundValue(registry, reference, TARGET, resolvedColorModeSchema);
  return result.success ? (
    <BoundColorModeControl
      node={node}
      systemMode={result.data.value}
      registry={registry}
    />
  ) : (
    <Issues issues={result.issues} />
  );
}

function Asset({ node, mode }: { node: ColorModeAssetNode; mode: ResolvedColorMode }) {
  if (node.type === 'ColorModeAvatar') {
    const { type: _type, mode: _mode, ...properties } = node;
    return <ColorModeAvatar {...properties} mode={mode} />;
  }
  const { type: _type, mode: _mode, ...properties } = node;
  return <ColorModeImage {...properties} mode={mode} />;
}

function BoundAsset({
  node,
  reference,
  registry,
}: {
  node: ColorModeAssetNode;
  reference: z.infer<typeof readStateBindingSchema>;
  registry: StateRegistry;
}) {
  const result = useBoundValue(registry, reference, TARGET, resolvedColorModeSchema);
  return result.success ? (
    <Asset node={node} mode={result.data.value} />
  ) : (
    <Issues issues={result.issues} />
  );
}

export function ColorModeAssetView({
  node,
  registry,
}: {
  node: ColorModeAssetNode;
  registry: StateRegistry;
}) {
  return typeof node.mode === 'object' ? (
    <BoundAsset node={node} reference={node.mode} registry={registry} />
  ) : (
    <Asset node={node} mode={node.mode} />
  );
}
