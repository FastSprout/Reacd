import { z } from 'zod';
import { stateBindingSchema, readStateBindingSchema } from '../state/binding.schema.js';
import type { BindingContract } from '../generative-v2/binding-contract.js';
import { booleanValueSchema } from '../state/boolean/boolean.schema.js';
import { checkboxSchema } from './checkbox.schema.js';

export const checkboxNodeSchema = checkboxSchema
  .omit({
    checked: true,
    onCheckedChange: true,
    indeterminate: true,
  })
  .extend({
    type: z.literal('Checkbox'),
    checked: stateBindingSchema,
    indeterminate: z.union([z.boolean(), readStateBindingSchema]).optional(),
  });

export function checkboxNodeBindings(
  node: z.infer<typeof checkboxNodeSchema>,
): BindingContract[] {
  return [
    {
      reference: node.checked,
      property: 'checked',
      kinds: ['boolean'],
      mode: node.checked.mode,
      schema: booleanValueSchema,
    },
    ...(typeof node.indeterminate === 'object'
      ? [
          {
            reference: node.indeterminate,
            property: 'indeterminate',
            kinds: ['boolean'] as const,
            mode: 'read' as const,
            schema: booleanValueSchema,
          },
        ]
      : []),
  ];
}
