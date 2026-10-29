import { z } from 'zod';
import { menuShape, validVisibleMenu } from '../form-menu-shared/menu.schema.js';
import {
  stateBindingSchema,
  writeStateBindingSchema,
} from '../state/binding.schema.js';
import {
  singleSelectionValueSchema,
  multipleSelectionValueSchema,
} from '../selection/index.js';
import { menuTextSchema } from '../form-menu-shared/text.schema.js';
import type { BindingContract } from '../generative-v2/binding-contract.js';

export const selectMenuNodeSchema = z
  .strictObject({
    ...menuShape,
    type: z.literal('SelectMenu'),
    mode: z.enum(['single', 'multiple']).optional(),
    value: stateBindingSchema,
    query: stateBindingSchema.optional(),
    queryReadOnly: z.boolean().optional(),
    open: writeStateBindingSchema.optional(),
  })
  .refine(validVisibleMenu, 'Visible values must exist in the options.')
  .refine(
    (node) => node.query === undefined || node.query.state !== node.value.state,
    'Selection and query must use different state keys.',
  );

export type SelectMenuNode = z.infer<typeof selectMenuNodeSchema>;

export function selectMenuBindings(node: SelectMenuNode): BindingContract[] {
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
    ...(node.query === undefined
      ? []
      : [
          {
            reference: node.query,
            property: 'query',
            mode: node.query.mode,
            kinds: ['text'] as const,
            schema: menuTextSchema,
          },
        ]),
    ...(node.open === undefined
      ? []
      : [
          {
            reference: node.open,
            property: 'open',
            mode: 'readWrite' as const,
            kinds: ['boolean'] as const,
            schema: z.boolean(),
          },
        ]),
  ];
}
