import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';

export function composerAction(
  key: string | undefined,
  actions: GenerativeActions,
  registry: StateRegistry,
): (() => void) | undefined {
  if (key === undefined) return undefined;
  return () => {
    const handler = Object.hasOwn(actions, key) ? actions[key] : undefined;
    if (typeof handler === 'function') handler({ state: registry });
  };
}
