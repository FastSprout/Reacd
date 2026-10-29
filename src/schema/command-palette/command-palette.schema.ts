import { z } from 'zod';
import { DATA_STATES } from '../../core/policy.js';
import { COMMAND_FILTERING, COMMAND_POLICY } from '../../core/command-policy.js';
import {
  labelSchema,
  pressSchema,
  textChangeSchema,
  textSchema,
} from '../shared/values.js';
import { linkSchema } from '../link/link.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { uniqueNavigationKeys } from '../navigation-shared/target.schema.js';

export const commandItemShape = {
  key: stateKeySchema,
  label: labelSchema,
  description: textSchema.optional(),
  keywords: z
    .array(labelSchema)
    .max(COMMAND_POLICY.maximumKeywords)
    .readonly()
    .optional(),
  disabled: z.boolean().optional(),
  href: linkSchema.shape.href.optional(),
};

export const commandItemSchema = z
  .strictObject({
    ...commandItemShape,
    onPress: pressSchema.optional(),
  })
  .refine(
    (item) => item.href === undefined || item.onPress === undefined,
    'Choose a link or an action.',
  );

export function validCommandGroups(
  groups: readonly {
    key: string;
    items: readonly { key: string }[];
  }[],
): boolean {
  if (!uniqueNavigationKeys(groups)) return false;
  const items = groups.flatMap((group) => group.items);
  return (
    items.length <= COMMAND_POLICY.maximumTotalItems && uniqueNavigationKeys(items)
  );
}

export const commandGroupsSchema = z
  .array(
    z.strictObject({
      key: stateKeySchema,
      label: labelSchema,
      items: z
        .array(commandItemSchema)
        .max(COMMAND_POLICY.maximumItemsPerGroup)
        .readonly(),
    }),
  )
  .max(COMMAND_POLICY.maximumGroups)
  .refine(
    validCommandGroups,
    'Command keys must be globally unique within the item budget.',
  )
  .readonly();

export const commandQuerySchema = z.string().max(COMMAND_POLICY.maximumQueryLength);
export const commandSelectSchema = z.custom<(key: string) => boolean | void>(
  (value) => typeof value === 'function',
  'Selection callback must be a function.',
);

export const commandPaletteSchema = z
  .strictObject({
    label: labelSchema,
    query: commandQuerySchema,
    onQueryChange: textChangeSchema,
    groups: commandGroupsSchema,
    onSelect: commandSelectSchema.optional(),
    filtering: z.enum(COMMAND_FILTERING).optional(),
    status: z.enum(DATA_STATES).optional(),
    disabled: z.boolean().optional(),
    emptyMessage: labelSchema.optional(),
    loadingMessage: labelSchema.optional(),
    errorMessage: labelSchema.optional(),
  })
  .refine(
    (props) =>
      props.onSelect !== undefined ||
      props.groups.every((group) =>
        group.items.every(
          (item) => item.href !== undefined || item.onPress !== undefined,
        ),
      ),
    'Every command requires a target or a selection callback.',
  );
