import { useMemo } from 'react';
import type { InteractiveTableNode } from '../../schema/table/generative.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { createDataTableController } from '../data-table/create-controller.js';
import { TableSession } from './table-session.js';
export function BoundTable({
  node,
  registry,
  onRetry,
}: {
  node: InteractiveTableNode;
  registry: StateRegistry;
  onRetry?: (() => void) | undefined;
}) {
  const controller = useMemo(
    () =>
      createDataTableController(registry, {
        columns: node.columns,
        bindings: node.bindings,
      }),
    [registry, node.columns, node.bindings],
  );
  return controller.success ? (
    <TableSession
      node={node}
      registry={registry}
      controller={controller.data}
      onRetry={onRetry}
    />
  ) : (
    <Issues issues={controller.issues} />
  );
}
