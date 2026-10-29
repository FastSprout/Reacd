import { z } from 'zod';
import { labelSchema } from '../shared/values.js';
import { selectionChangeSchema } from '../shared/choices.js';
import { contentNavigationItemsSchema } from '../content-outline/items.schema.js';
import {
  contentCurrentChangeSchema,
  contentCurrentSchema,
  contentExpandedKeysSchema,
  contentExpansionSchema,
} from '../content-outline/value.schema.js';

export const contentNavigationContentSchema = z.strictObject({
  label: labelSchema,
  items: contentNavigationItemsSchema,
  disabled: z.boolean().optional(),
  expansionReadOnly: z.boolean().optional(),
  emptyLabel: labelSchema.optional(),
});

export const contentNavigationSchema = contentNavigationContentSchema
  .extend({
    currentKey: z.string().optional(),
    onCurrentChange: contentCurrentChangeSchema.optional(),
    expandedKeys: contentExpandedKeysSchema,
    onExpandedKeysChange: selectionChangeSchema,
  })
  .refine(
    (props) =>
      props.currentKey === undefined ||
      contentCurrentSchema(props.items).safeParse(props.currentKey).success,
    'Current key must identify a declared document.',
  )
  .refine(
    (props) =>
      contentExpansionSchema(props.items).safeParse(props.expandedKeys).success,
    'Invalid expanded document branches.',
  );
