import type { z } from 'zod';
import { Table } from '../../components/table/index.js';
import type { tableNodeSchema } from '../../schema/table/generative.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { BoundTable } from './bound-table.js';
export function GenerativeTable({
  node,
  registry,
  actions,
}: {
  node: z.infer<typeof tableNodeSchema>;
  registry: StateRegistry;
  actions: GenerativeActions;
}) {
  const { retryAction } = node;
  const onRetry =
    retryAction === undefined
      ? undefined
      : () => {
          const handler = Object.hasOwn(actions, retryAction)
            ? actions[retryAction]
            : undefined;
          if (typeof handler === 'function') handler({ state: registry });
        };
  if (node.mode === 'interactive')
    return <BoundTable node={node} registry={registry} onRetry={onRetry} />;
  const { type: _type, retryAction: _retry, ...properties } = node;
  return <Table {...properties} onRetry={onRetry} />;
}
