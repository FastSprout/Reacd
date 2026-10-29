import type { ReactNode } from 'react';
import { CommandPalette } from '../../components/command-palette/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { useCommandModel } from './use-command-model.js';
import type { CommandNode } from './use-command-model.js';

export function BoundCommandPalette(properties: {
  node: CommandNode;
  registry: StateRegistry;
  actions: GenerativeActions;
}): ReactNode {
  const result = useCommandModel(properties);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <>
      {result.data.issues.length > 0 && <Issues issues={result.data.issues} />}
      <CommandPalette {...result.data.properties} />
    </>
  );
}
