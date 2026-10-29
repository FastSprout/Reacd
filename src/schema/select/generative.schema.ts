import { z } from 'zod';
import { stateBindingSchema } from '../state/binding.schema.js';
import type { BindingContract } from '../generative-v2/binding-contract.js';
import {
  singleSelectionValueSchema,
  multipleSelectionValueSchema,
} from '../selection/index.js';
import { selectPropertiesSchema } from './properties.schema.js';

export const selectNodeSchema = selectPropertiesSchema.extend({
  type: z.literal('Select'),
  mode: z.enum(['single', 'multiple']).optional(),
  value: stateBindingSchema,
});

export function selectNodeBindings(
  node: z.infer<typeof selectNodeSchema>,
): BindingContract[] {
  return [
    {
      reference: node.value,
      property: 'value',
      mode: node.value.mode,
      kinds: node.mode === 'multiple' ? ['selection'] : ['text'],
      schema:
        node.mode === 'multiple'
          ? multipleSelectionValueSchema(node.items)
          : singleSelectionValueSchema(node.items),
    },
  ];
}
