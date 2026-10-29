import { useMemo } from 'react';
import type { ColorModeControlNode } from '../../schema/color-mode/generative.types.js';
import type { ResolvedColorMode } from '../../core/color-mode-policy.js';
import { resolveColorMode } from '../../core/color-mode.js';
import { colorModeValueSchema } from '../../schema/color-mode/color-mode.schema.js';
import { ColorModeButton } from '../../components/color-mode-button/index.js';
import { ColorModeSwitch } from '../../components/color-mode-switch/index.js';
import { ColorModeSelect } from '../../components/color-mode-select/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

export function BoundColorModeControl({
  node,
  registry,
  systemMode,
}: {
  node: ColorModeControlNode;
  registry: StateRegistry;
  systemMode: ResolvedColorMode;
}) {
  const target = useMemo(
    () => ({ kinds: ['text'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const result = useBoundValue(registry, node.value, target, colorModeValueSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type, value: reference, systemMode: _system, readOnly, ...properties } = node;
  const common = {
    ...properties,
    value: result.data.value,
    resolvedMode: resolveColorMode(result.data.value, systemMode),
    onValueChange: result.data.write,
    readOnly: readOnly || reference.mode === 'read',
  };
  switch (type) {
    case 'ColorModeButton':
      return <ColorModeButton {...common} />;
    case 'ColorModeSwitch':
      return <ColorModeSwitch {...common} />;
    case 'ColorModeSelect':
      return <ColorModeSelect {...common} />;
  }
}
