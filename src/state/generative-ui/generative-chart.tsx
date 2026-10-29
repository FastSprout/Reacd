import type { z } from 'zod';
import { Chart } from '../../components/chart/index.js';
import type { chartNodeSchema } from '../../schema/chart/index.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
export function GenerativeChart({
  node,
  registry,
  actions,
}: {
  node: z.infer<typeof chartNodeSchema>;
  registry: StateRegistry;
  actions: GenerativeActions;
}) {
  const { type: _type, retryAction, ...properties } = node;
  const retry =
    retryAction === undefined
      ? undefined
      : () => {
          const handler = Object.hasOwn(actions, retryAction)
            ? actions[retryAction]
            : undefined;
          if (typeof handler === 'function') handler({ state: registry });
        };
  return <Chart {...properties} onRetry={retry} />;
}
