import { User } from '../../components/user/user.js';
import type { UserNode } from '../../schema/user/generative.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';

export function GenerativeUser({
  node,
  registry,
  actions,
}: {
  node: UserNode;
  registry: StateRegistry;
  actions: GenerativeActions;
}) {
  const { type: _type, action, ...properties } = node;
  return (
    <User
      {...properties}
      onPress={
        action === undefined
          ? undefined
          : () => {
              const handler = Object.hasOwn(actions, action)
                ? actions[action]
                : undefined;
              if (typeof handler === 'function') handler({ state: registry });
            }
      }
    />
  );
}
