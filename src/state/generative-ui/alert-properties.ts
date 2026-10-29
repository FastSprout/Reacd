import type { AlertNodeDeclaration } from '../../schema/alert/generative.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';

export function alertProperties(
  node: Omit<AlertNodeDeclaration, 'type' | 'open'>,
  registry: StateRegistry,
  actions: GenerativeActions,
  open: boolean | undefined,
  onOpenChange?: (value: boolean) => void,
) {
  const { actions: controls, closeLabel, ...properties } = node;
  return {
    ...properties,
    open,
    onOpenChange,
    closeLabel: onOpenChange === undefined ? undefined : closeLabel,
    actions: controls?.map(({ action, ...control }) => ({
      ...control,
      onPress() {
        const handler = Object.hasOwn(actions, action) ? actions[action] : undefined;
        if (typeof handler === 'function') handler({ state: registry });
      },
    })),
  };
}
