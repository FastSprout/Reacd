import { z } from 'zod';
import type {
  ContentOutlineItem,
  ContentNavigationItem,
} from '../../core/content-outline.js';
import { contentOutlineItems } from '../../core/content-outline.js';
import { TREE_POLICY } from '../../core/tree-policy.js';
import { boundedTree } from '../../core/tree-budget.js';
import { identifierSchema } from '../shared/identifier.js';
import { labelSchema } from '../shared/values.js';
import { linkSchema } from '../link/link.schema.js';

const itemShape = {
  key: identifierSchema,
  label: labelSchema,
  disabled: z.boolean().optional(),
};

const tocItemSchema: z.ZodType<ContentOutlineItem> = z.lazy(() =>
  z
    .strictObject({
      ...itemShape,
      children: z.array(tocItemSchema).min(1).readonly().optional(),
    })
    .readonly(),
);

const navigationItemSchema: z.ZodType<ContentNavigationItem> = z.lazy(() =>
  z
    .strictObject({
      ...itemShape,
      href: linkSchema.shape.href.optional(),
      newWindow: z.boolean().optional(),
      children: z.array(navigationItemSchema).min(1).readonly().optional(),
    })
    .refine(
      (item) =>
        (item.href !== undefined || item.children !== undefined) &&
        (!item.newWindow || item.href !== undefined),
      'Every leaf needs a link, and a new window needs a destination.',
    )
    .readonly(),
);

function boundedItems<Item extends ContentOutlineItem>(schema: z.ZodType<Item>) {
  return z
    .unknown()
    .refine(boundedTree, {
      message: 'Document links exceed their bounded tree contract.',
      abort: true,
    })
    .pipe(z.array(schema).max(TREE_POLICY.maxNodes).readonly())
    .refine((items) => {
      const flat = contentOutlineItems(items);
      return new Set(flat.map((item) => item.key)).size === flat.length;
    }, 'Document keys must be globally unique.');
}

export const contentNavigationItemsSchema = boundedItems(navigationItemSchema);
export const contentTocItemsSchema = boundedItems(tocItemSchema);
