import { z } from 'zod';
import { SELECTION_POLICY } from '../../core/selection-policy.js';
import {
  selectionKeySchema,
  selectionOptionsSchema,
  singleSelectionValueSchema,
  multipleSelectionValueSchema,
} from '../selection/index.js';
import {
  menuShape,
  menuOpenChangeSchema,
  menuTextChangeSchema,
  validVisibleMenu,
} from '../form-menu-shared/menu.schema.js';
import { menuTextSchema } from '../form-menu-shared/text.schema.js';

export const selectMenuShape = {
  ...menuShape,
  query: menuTextSchema.optional(),
  onQueryChange: menuTextChangeSchema.optional(),
  queryReadOnly: z.boolean().optional(),
  open: z.boolean().optional(),
  onOpenChange: menuOpenChangeSchema.optional(),
};

function validPairs(properties: {
  query?: string | undefined;
  onQueryChange?: unknown;
  open?: boolean | undefined;
  onOpenChange?: unknown;
}) {
  return (
    (properties.query === undefined) === (properties.onQueryChange === undefined) &&
    (properties.open === undefined) === (properties.onOpenChange === undefined)
  );
}

const single = z
  .strictObject({
    ...selectMenuShape,
    mode: z.literal('single').optional(),
    value: z.union([z.literal(SELECTION_POLICY.emptySingleValue), selectionKeySchema]),
    onValueChange: menuTextChangeSchema,
  })
  .refine(validVisibleMenu, 'Visible values must exist in the options.')
  .refine(validPairs, 'Supply each controlled value with its change callback.')
  .refine(
    (props) =>
      selectionOptionsSchema.safeParse(props.items).success &&
      singleSelectionValueSchema(props.items).safeParse(props.value).success,
    'Selected value must exist in the options.',
  );

const multipleChangeSchema = z.custom<(value: readonly string[]) => boolean | void>(
  (value) => typeof value === 'function',
  'Selection change must be a function.',
);

const multiple = z
  .strictObject({
    ...selectMenuShape,
    mode: z.literal('multiple'),
    value: z.array(selectionKeySchema).max(SELECTION_POLICY.maximumOptions).readonly(),
    onValueChange: multipleChangeSchema,
  })
  .refine(validVisibleMenu, 'Visible values must exist in the options.')
  .refine(validPairs, 'Supply each controlled value with its change callback.')
  .refine(
    (props) =>
      selectionOptionsSchema.safeParse(props.items).success &&
      multipleSelectionValueSchema(props.items).safeParse(props.value).success,
    'Selected values must be unique options.',
  );

export const selectMenuSchema = z.discriminatedUnion('mode', [single, multiple]);
