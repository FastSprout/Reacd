import { z } from 'zod';
import { menuTextSchema } from '../form-menu-shared/text.schema.js';
import { selectionKeySchema } from '../selection/index.js';
import {
  menuShape,
  menuOpenChangeSchema,
  menuTextChangeSchema,
  validVisibleMenu,
} from '../form-menu-shared/menu.schema.js';

export const inputMenuItemsSchema = menuShape.items.refine(
  (items) => items.every((item) => menuTextSchema.safeParse(item.label).success),
  'Suggestion labels must not contain line breaks.',
);

export const inputMenuSuggestionSchema = z
  .strictObject({
    value: selectionKeySchema,
    text: menuTextSchema,
  })
  .readonly();
export const inputMenuSelectSchema = z.custom<
  (suggestion: z.infer<typeof inputMenuSuggestionSchema>) => boolean | void
>((value) => typeof value === 'function', 'Suggestion callback must be a function.');

export const inputMenuSchema = z
  .strictObject({
    ...menuShape,
    items: inputMenuItemsSchema,
    value: menuTextSchema,
    onValueChange: menuTextChangeSchema,
    onSuggestionSelect: inputMenuSelectSchema.optional(),
    open: z.boolean().optional(),
    onOpenChange: menuOpenChangeSchema.optional(),
  })
  .refine(validVisibleMenu, 'Visible values must exist in suggestion items.')
  .refine(
    (props) => (props.open === undefined) === (props.onOpenChange === undefined),
    'Supply open and onOpenChange together.',
  );
