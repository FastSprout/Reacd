import { atom, useAtomValue } from 'jotai';
import { useMemo, useSyncExternalStore } from 'react';
import type { ValidationIssue } from '../../core/render-port.js';
import { Table } from '../../components/table/index.js';
import type { InteractiveTableNode } from '../../schema/table/generative.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { DataTableController } from '../data-table/controller.types.js';
import { readTableModel } from '../data-table/read-model.js';
import { commitTableView } from '../table/commit-view.js';
import { createTableConnection } from '../table/connection.js';
export function TableSession({
  node,
  registry,
  controller,
  onRetry,
}: {
  node: InteractiveTableNode;
  registry: StateRegistry;
  controller: DataTableController;
  onRetry?: (() => void) | undefined;
}) {
  const session = useMemo(
    () => ({
      controller,
      errors: atom<readonly ValidationIssue[]>([]),
      connection: createTableConnection(controller),
    }),
    [controller],
  );
  const connected = useSyncExternalStore(
    session.connection.subscribe,
    session.connection.snapshot,
    session.connection.serverSnapshot,
  );
  const issues = useAtomValue(session.errors, { store: registry.store });
  useAtomValue(controller.atom, { store: registry.store });
  if (!connected.success) return <Issues issues={connected.issues} />;
  const model = readTableModel(registry.read, node.columns, node.bindings);
  if (!model.success) return <Issues issues={model.issues} />;
  return (
    <>
      {issues.length > 0 && <Issues issues={issues} />}
      <Table
        mode="interactive"
        caption={node.caption}
        model={model.data}
        editable={{
          selection: node.bindings.selection.mode === 'readWrite',
          sorting: node.bindings.sorting.mode === 'readWrite',
          filters: node.bindings.filters.mode === 'readWrite',
          pagination: node.bindings.pagination.mode === 'readWrite',
        }}
        readOnly={node.readOnly}
        disabled={node.disabled}
        state={node.state}
        emptyMessage={node.emptyMessage}
        errorMessage={node.errorMessage}
        loadingMessage={node.loadingMessage}
        retryLabel={node.retryLabel}
        onRetry={onRetry}
        onModelChange={(next) => {
          const result = commitTableView(registry, node.bindings, model.data, next);
          registry.store.set(session.errors, result.success ? [] : result.issues);
        }}
      />
    </>
  );
}
