import { useMemo, useState } from 'react';
import type { ValidationIssue } from '../../core/render-port.js';
import {
  commandQuerySchema,
} from '../../schema/command-palette/command-palette.schema.js';
import {
  commandSelectionSchema,
} from '../../schema/command-palette/generative.schema.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { useBoundValue } from './use-bound-value.js';

import type { Result } from '../../core/result.js';
import type { CommandPaletteProps } from '../../components/command-palette/index.js';

export type CommandNode = Extract<GenerativeNode, { type: 'CommandPalette' }>;
type Item = CommandNode['groups'][number]['items'][number];
interface CommandModel {
  properties: CommandPaletteProps;
  issues: readonly ValidationIssue[];
  report: (issues: readonly ValidationIssue[]) => void;
}

export function useCommandModel({
  node,
  registry,
  actions,
}: {
  node: CommandNode;
  registry: StateRegistry;
  actions: GenerativeActions;
}): Result<CommandModel> {
  const target = useMemo(
    () => ({ kinds: ['text'] as const, mode: 'readWrite' as const }),
    [],
  );
  const query = useBoundValue(registry, node.query, target, commandQuerySchema);
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
    target,
    selectionSchema,
  );
  const [issues, setIssues] = useState<readonly ValidationIssue[]>([]);
  if (!query.success) return query;
  if (!selection.success) return selection;
  const {
    type: _type,
    query: _query,
    selection: _selection,
    groups,
    ...properties
  } = node;
  function resolve(item: Item) {
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
  }
  return {
    success: true,
    data: {
      issues,
      report: setIssues,
      properties: {
        ...properties,
        query: query.data.value,
        groups: groups.map((group) => ({ ...group, items: group.items.map(resolve) })),
        onQueryChange(value) {
          const changed = query.data.write(value);
          setIssues(changed.success ? [] : changed.issues);
        },
        onSelect(key) {
          if (node.selection === undefined) return true;
          const changed = selection.data.write(key);
          setIssues(changed.success ? [] : changed.issues);
          return changed.success;
        },
      },
    },
  };
}
