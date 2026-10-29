import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { z } from 'zod';
import type { ValidationIssue } from '../../core/render-port.js';
import { Toast } from '../../components/toast/index.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import type { GenerativeActions } from './generative-ui.props.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { useBoundValue } from './use-bound-value.js';
const openSchema = z.boolean();
export function BoundToast({
  node,
  registry,
  actions,
}: {
  node: Extract<GenerativeNode, { type: 'Toast' }>;
  registry: StateRegistry;
  actions: GenerativeActions;
}): ReactNode {
  const target = useMemo(
    () => ({
      kinds: ['boolean'] as const,
      mode: 'readWrite' as const,
    }),
    [],
  );
  const current = useBoundValue(registry, node.open, target, openSchema);
  const [issues, setIssues] = useState<readonly ValidationIssue[]>([]);
  if (!current.success) return <Issues issues={current.issues} />;
  const { type: _type, open: _open, action, ...properties } = node;
  return (
    <>
      {issues.length > 0 && <Issues issues={issues} />}
      <Toast
        {...properties}
        open={current.data.value}
        onOpenChange={(value) => {
          const changed = current.data.write(value);
          setIssues(changed.success ? [] : changed.issues);
          return changed.success;
        }}
        action={
          action === undefined
            ? undefined
            : {
                label: action.label,
                onPress() {
                  const handler = Object.hasOwn(actions, action.action)
                    ? actions[action.action]
                    : undefined;
                  if (typeof handler !== 'function') return false;
                  handler({ state: registry });
                  return true;
                },
              }
        }
      />
    </>
  );
}
