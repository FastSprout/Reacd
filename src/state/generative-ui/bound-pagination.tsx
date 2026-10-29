import { useMemo, useState } from 'react';
import type { ValidationIssue } from '../../core/render-port.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import { paginationBoundValueSchema } from '../../schema/pagination/value.schema.js';
import { Pagination } from '../../components/pagination/pagination.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

export function BoundPagination({
  node,
  registry,
}: {
  node: Extract<GenerativeNode, { type: 'Pagination' }>;
  registry: StateRegistry;
}) {
  const target = useMemo(
    () => ({ kinds: ['pagination'] as const, mode: node.value.mode }),
    [node.value.mode],
  );
  const schema = useMemo(
    () => paginationBoundValueSchema(node.totalItems, node.navigation),
    [node.totalItems, node.navigation],
  );
  const result = useBoundValue(registry, node.value, target, schema);
  const [issues, setIssues] = useState<readonly ValidationIssue[]>([]);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, disabled, ...properties } = node;
  return (
    <>
      {issues.length > 0 && <Issues issues={issues} />}
      <Pagination
        {...properties}
        value={result.data.value}
        disabled={disabled || node.value.mode === 'read'}
        onValueChange={
          node.value.mode === 'read'
            ? undefined
            : (value) => {
                const changed = result.data.write(value);
                setIssues(changed.success ? [] : changed.issues);
                return changed.success;
              }
        }
      />
    </>
  );
}
