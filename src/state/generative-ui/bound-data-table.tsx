import { atom, useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import type { Result } from '../../core/result.js';
import type { ValidationIssue } from '../../core/render-port.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import { DataTable } from '../../components/data-table/data-table.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { createDataTableController } from '../data-table/create-controller.js';
import type { DataTableSnapshot } from '../data-table/controller.types.js';

export function BoundDataTable({
  node,
  registry,
}: {
  node: Extract<GenerativeNode, { type: 'DataTable' }>;
  registry: StateRegistry;
}) {
  const controller = useMemo(
    () =>
      createDataTableController(registry, {
        columns: node.columns,
        bindings: node.bindings,
      }),
    [registry, node.columns, node.bindings],
  );
  const snapshotAtom = useMemo(
    () =>
      controller.success
        ? controller.data.atom
        : atom<Result<DataTableSnapshot>>(controller),
    [controller],
  );
  const state = useAtomValue(snapshotAtom, { store: registry.store });
  const [issues, setIssues] = useState<readonly ValidationIssue[]>([]);
  useEffect(() => {
    if (!controller.success) return;
    const lease = controller.data.connect();
    return lease.success ? lease.data : undefined;
  }, [controller]);
  function report(result: Result<void>) {
    setIssues(result.success ? [] : result.issues);
  }
  if (!controller.success) return <Issues issues={controller.issues} />;
  if (!state.success) return <Issues issues={state.issues} />;
  const table = controller.data;
  return (
    <>
      {issues.length > 0 && <Issues issues={issues} />}
      <DataTable
        {...state.data}
        caption={node.caption}
        state={node.state}
        emptyMessage={node.emptyMessage}
        errorMessage={node.errorMessage}
        onSelectionChange={
          node.bindings.selection.mode === 'read'
            ? undefined
            : (value) => report(table.select(value))
        }
        onSortingChange={
          node.bindings.sorting.mode === 'read'
            ? undefined
            : (value) => report(table.sort(value))
        }
        onFiltersChange={
          node.bindings.filters.mode === 'read'
            ? undefined
            : (value) => report(table.filter(value))
        }
        onPaginationChange={
          node.bindings.pagination.mode === 'read'
            ? undefined
            : (value) => report(table.paginate(value))
        }
      />
    </>
  );
}
