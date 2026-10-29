import type { ReactNode } from 'react';
import type { z } from 'zod';
import { FormField } from '../../components/form-field/index.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { fieldErrorSchema } from '../../schema/form-field/index.js';
import type { FormFieldNode } from '../../schema/form-field/index.js';
import type { readStateBindingSchema } from '../../schema/state/binding.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';
import { useBoundValue } from './use-bound-value.js';

type FieldNode = Omit<FormFieldNode<unknown>, 'children'>;
type FieldProperties = Omit<FieldNode, 'type' | 'error'>;
const TARGET = { kinds: ['text'], mode: 'read' } as const;

function BoundFieldError({
  properties,
  reference,
  registry,
  children,
}: {
  properties: FieldProperties;
  reference: z.infer<typeof readStateBindingSchema>;
  registry: StateRegistry;
  children: Exclude<ReactNode, undefined>;
}) {
  const result = useBoundValue(registry, reference, TARGET, fieldErrorSchema);
  if (!result.success) return <Issues issues={result.issues} />;
  return (
    <FormField {...properties} error={result.data.value}>
      {children}
    </FormField>
  );
}

export function BoundFormField({
  node,
  registry,
  children,
}: {
  node: FieldNode;
  registry: StateRegistry;
  children: Exclude<ReactNode, undefined>;
}) {
  const { type: _type, error, ...properties } = node;
  return typeof error === 'object' ? (
    <BoundFieldError properties={properties} reference={error} registry={registry}>
      {children}
    </BoundFieldError>
  ) : (
    <FormField {...properties} error={error}>
      {children}
    </FormField>
  );
}
