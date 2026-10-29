import type { ColorModeNode } from '../../schema/color-mode/generative.types.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { BoundColorModeControl } from './color-mode-control.js';
import { BoundColorModeSystem, ColorModeAssetView } from './color-mode-readers.js';

export function ColorModeNodeView({
  node,
  registry,
}: {
  node: ColorModeNode;
  registry: StateRegistry;
}) {
  if (node.type === 'ColorModeAvatar' || node.type === 'ColorModeImage')
    return <ColorModeAssetView node={node} registry={registry} />;
  return typeof node.systemMode === 'object' ? (
    <BoundColorModeSystem node={node} reference={node.systemMode} registry={registry} />
  ) : (
    <BoundColorModeControl
      node={node}
      systemMode={node.systemMode}
      registry={registry}
    />
  );
}
