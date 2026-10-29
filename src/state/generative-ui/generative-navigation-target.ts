import type { z } from 'zod';
import type {
  navigationTransportTargetSchema,
} from '../../schema/navigation-shared/target.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';

export function generativeNavigationTarget(
  item: z.infer<typeof navigationTransportTargetSchema>,
  registry: StateRegistry,
  actions: GenerativeActions,
) {
  const { action, ...properties } = item;
  return {
    ...properties,
    onPress:
      action === undefined
        ? undefined
        : () => {
            const handler = Object.hasOwn(actions, action)
              ? actions[action]
              : undefined;
            if (typeof handler === 'function') handler({ state: registry });
          },
  };
}
