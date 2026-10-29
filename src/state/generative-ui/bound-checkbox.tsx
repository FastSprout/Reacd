import { useMemo } from 'react';
import type { z } from 'zod';
import { Checkbox } from '../../components/checkbox/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import type { checkboxNodeSchema } from '../../schema/checkbox/index.js';
import { booleanValueSchema } from '../../schema/state/boolean/boolean.schema.js';
import type { readStateBindingSchema } from '../../schema/state/binding.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

type CheckboxNode = z.infer<typeof checkboxNodeSchema>;
interface BoundCheckboxProps {
  readonly node: CheckboxNode;
  readonly registry: StateRegistry;
}
const READ_TARGET = { kinds: ['boolean'], mode: 'read' } as const;

function BoundChecked({
  node,
  registry,
  indeterminate,
}: BoundCheckboxProps & {
  readonly indeterminate: boolean | undefined;
}) {
  const target = useMemo(
    () => ({ kinds: ['boolean'] as const, mode: node.checked.mode }),
    [node.checked.mode],
  );
  const result = useBoundValue(registry, node.checked, target, booleanValueSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  const {
    type: _type,
    checked: _checked,
    readOnly,
    indeterminate: _indeterminate,
    ...properties
  } = node;
  return (
    <Checkbox
      {...properties}
      checked={result.data.value}
      onCheckedChange={result.data.write}
      indeterminate={indeterminate}
      readOnly={readOnly || node.checked.mode === 'read'}
    />
  );
}

function BoundMixed({
  node,
  registry,
  reference,
}: BoundCheckboxProps & {
  readonly reference: z.infer<typeof readStateBindingSchema>;
}) {
  const result = useBoundValue(registry, reference, READ_TARGET, booleanValueSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <BoundChecked node={node} registry={registry} indeterminate={result.data.value} />
  );
}

export function BoundCheckbox({ node, registry }: BoundCheckboxProps) {
  return typeof node.indeterminate === 'object' ? (
    <BoundMixed node={node} registry={registry} reference={node.indeterminate} />
  ) : (
    <BoundChecked node={node} registry={registry} indeterminate={node.indeterminate} />
  );
}
