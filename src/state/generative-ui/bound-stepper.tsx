import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ValidationIssue } from '../../core/render-port.js';
import { Stepper } from '../../components/stepper/index.js';
import { stepperValueSchema } from '../../schema/stepper/stepper.schema.js';
import type { GenerativeNode } from '../../schema/generative-v2/document.schema.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

export function BoundStepper({
  node,
  registry,
  renderChild,
}: {
  node: Extract<GenerativeNode, { type: 'Stepper' }>;
  registry: StateRegistry;
  renderChild: (node: GenerativeNode, index: number) => ReactNode;
}) {
  const target = useMemo(
    () => ({
      kinds: ['text'] as const,
      mode: node.value.mode,
    }),
    [node.value.mode],
  );
  const schema = useMemo(() => stepperValueSchema(node.items), [node.items]);
  const result = useBoundValue(registry, node.value, target, schema);
  const [issues, setIssues] = useState<readonly ValidationIssue[]>([]);
  if (!result.success) return <Issues issues={result.issues} />;
  const { type: _type, value: _value, items, disabled, ...properties } = node;
  return (
    <>
      {issues.length > 0 && <Issues issues={issues} />}
      <Stepper
        {...properties}
        disabled={disabled || node.value.mode === 'read'}
        items={items.map((item) => ({
          ...item,
          content: item.content?.map(renderChild),
        }))}
        value={result.data.value}
        onValueChange={(value) => {
          const changed = result.data.write(value);
          setIssues(changed.success ? [] : changed.issues);
        }}
      />
    </>
  );
}
