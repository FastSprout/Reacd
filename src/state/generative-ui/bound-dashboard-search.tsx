import { useMemo, useState } from 'react';
import { DashboardSearch } from '../../components/dashboard-search/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import { commandQuerySchema } from
  '../../schema/command-palette/command-palette.schema.js';
import { commandSelectionSchema } from
  '../../schema/command-palette/generative.schema.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { DASHBOARD_DEFAULTS } from '../../core/dashboard-policy.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { useBoundValue } from './use-bound-value.js';

type SearchNode = Extract<GenerativeNode, { type: 'DashboardSearch' }>;
const TEXT_TARGET = { kinds: ['text'], mode: 'readWrite' } as const;
const BOOLEAN_TARGET = { kinds: ['boolean'], mode: 'readWrite' } as const;

export function BoundDashboardSearch({
  node,
  registry,
  actions,
}: {
  node: SearchNode;
  registry: StateRegistry;
  actions: GenerativeActions;
}) {
  const open = useBoundValue(registry, node.open, BOOLEAN_TARGET, booleanValueSchema);
  const query = useBoundValue(registry, node.query, TEXT_TARGET, commandQuerySchema);
  const selectionSchema = useMemo(
    () =>
      node.selection === undefined
        ? commandQuerySchema
        : commandSelectionSchema(node.groups),
    [node.selection, node.groups],
  );
  const selection = useBoundValue(
    registry,
    node.selection ?? node.query,
    TEXT_TARGET,
    selectionSchema,
  );
  const [rejected, setRejected] = useState(false);
  if (!open.success) return <Issues issues={open.issues} />;
  if (!query.success) return <Issues issues={query.issues} />;
  if (!selection.success) return <Issues issues={selection.issues} />;
  const {
    type: _type,
    open: _open,
    query: _query,
    selection: _selection,
    groups,
    ...properties
  } = node;
  return (
    <DashboardSearch
      {...properties}
      open={open.data.value}
      onOpenChange={(next) => {
        const result = open.data.write(next);
        setRejected(!result.success);
      }}
      query={query.data.value}
      onQueryChange={(next) => {
        const result = query.data.write(next);
        setRejected(!result.success);
      }}
      status={rejected ? 'error' : node.status}
      errorMessage={rejected ? DASHBOARD_DEFAULTS.stateRejected : node.errorMessage}
      groups={groups.map((group) => ({
        ...group,
        items: group.items.map((item) => {
          const { action, ...rest } = item;
          return {
            ...rest,
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
        }),
      }))}
      onSelect={(key) => {
        const updates = [{ key: node.open.state, value: false }];
        const result =
          node.selection === undefined
            ? registry.transaction(updates)
            : registry.transaction([
                ...updates,
                { key: node.selection.state, value: key },
              ]);
        setRejected(!result.success);
        return result.success;
      }}
    />
  );
}
