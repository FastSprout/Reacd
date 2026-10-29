import { z } from 'zod';
import { COMMAND_POLICY } from '../../core/command-policy.js';
import { labelSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';
import {
  commandPaletteSchema,
  commandItemShape,
  validCommandGroups,
} from './command-palette.schema.js';

const itemSchema = z
  .strictObject({
    ...commandItemShape,
    action: stateKeySchema.optional(),
  })
  .refine(
    (item) => item.href === undefined || item.action === undefined,
    'Choose a link or a registered action.',
  );

const {
  onQueryChange: _query,
  onSelect: _select,
  ...shape
} = commandPaletteSchema.shape;
export const commandPaletteNodeSchema = z
  .strictObject({
    ...shape,
    type: z.literal('CommandPalette'),
    query: writeStateBindingSchema,
    selection: writeStateBindingSchema.optional(),
    groups: z
      .array(
        z.strictObject({
          key: stateKeySchema,
          label: labelSchema,
          items: z
            .array(itemSchema)
            .max(COMMAND_POLICY.maximumItemsPerGroup)
            .readonly(),
        }),
      )
      .max(COMMAND_POLICY.maximumGroups)
      .refine(
        validCommandGroups,
        'Command keys must be globally unique within the item budget.',
      )
      .readonly(),
  })
  .refine(
    (node) =>
      node.selection !== undefined ||
      node.groups.every((group) =>
        group.items.every(
          (item) => item.href !== undefined || item.action !== undefined,
        ),
      ),
    'Every command requires a target or a selection state binding.',
  );

export function commandSelectionSchema(
  groups: readonly {
    items: readonly { key: string }[];
  }[],
) {
  const keys = new Set(groups.flatMap((group) => group.items.map((item) => item.key)));
  return z
    .string()
    .refine(
      (value) => value === '' || keys.has(value),
      'The selected command key is not declared.',
    );
}
