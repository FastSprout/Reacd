import { z } from 'zod';
import { labelSchema } from '../shared/values.js';
import { contentTocItemsSchema } from '../content-outline/items.schema.js';
import {
  contentCurrentChangeSchema,
  contentCurrentSchema,
} from '../content-outline/value.schema.js';

export const contentTocContentSchema = z.strictObject({
  label: labelSchema,
  items: contentTocItemsSchema,
  disabled: z.boolean().optional(),
  emptyLabel: labelSchema.optional(),
});

export const contentTocSchema = contentTocContentSchema
  .extend({
    currentKey: z.string().optional(),
    onCurrentChange: contentCurrentChangeSchema.optional(),
  })
  .refine(
    (props) =>
      props.currentKey === undefined ||
      contentCurrentSchema(props.items).safeParse(props.currentKey).success,
    'Current key must identify a declared document.',
  );
