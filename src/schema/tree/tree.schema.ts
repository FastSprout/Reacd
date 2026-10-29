import { z } from 'zod';
import { labelSchema } from '../shared/values.js';
import { selectionChangeSchema } from '../shared/choices.js';
import { treeItemsSchema } from './items.schema.js';
import { treeIdsSchema, treeValueSchema, treeExpandedSchema } from './value.schema.js';

export const treeContentSchema = z.strictObject({
  label: labelSchema,
  items: treeItemsSchema,
  multiple: z.boolean().optional(),
  disabled: z.boolean().optional(),
  selectionReadOnly: z.boolean().optional(),
  expansionReadOnly: z.boolean().optional(),
  emptyLabel: labelSchema.optional(),
});
export const treeSchema = treeContentSchema
  .extend({
    value: treeIdsSchema,
    expanded: treeIdsSchema,
    onValueChange: selectionChangeSchema,
    onExpandedChange: selectionChangeSchema,
  })
  .refine(
    (props) =>
      treeValueSchema(props.items, props.multiple).safeParse(props.value).success,
    'Invalid selected tree ids.',
  )
  .refine(
    (props) => treeExpandedSchema(props.items).safeParse(props.expanded).success,
    'Invalid expanded tree ids.',
  );
