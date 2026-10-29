import { z } from 'zod';
import {
  ACTION_MENU_INTENTS,
  ACTION_MENU_POLICY,
} from '../../core/action-menu-policy.js';
import { labelSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { linkSchema } from '../link/link.schema.js';
import { uniqueNavigationKeys } from '../navigation-shared/target.schema.js';

export const menuPressSchema = z.custom<() => boolean | void>(
  (value) => typeof value === 'function',
  'Menu action must be a function.',
);
export const menuBooleanChangeSchema = z.custom<(value: boolean) => boolean | void>(
  (value) => typeof value === 'function',
  'Checkbox change must be a function.',
);
export const menuTextChangeSchema = z.custom<(value: string) => boolean | void>(
  (value) => typeof value === 'function',
  'Radio change must be a function.',
);
export const menuItemShape = {
  key: stateKeySchema,
  label: labelSchema,
  disabled: z.boolean().optional(),
  closeOnSelect: z.boolean().optional(),
};
export const menuActionSchema = z.strictObject({
  ...menuItemShape,
  type: z.literal('action'),
  intent: z.enum(ACTION_MENU_INTENTS).optional(),
  onPress: menuPressSchema,
});
export const menuLinkSchema = z.strictObject({
  ...menuItemShape,
  type: z.literal('link'),
  href: linkSchema.shape.href,
  newWindow: z.boolean().optional(),
});
export const menuCheckboxSchema = z.strictObject({
  ...menuItemShape,
  type: z.literal('checkbox'),
  checked: z.boolean(),
  onCheckedChange: menuBooleanChangeSchema,
});
export const menuOptionsSchema = z
  .array(
    z.strictObject({
      value: stateKeySchema,
      label: labelSchema,
      disabled: z.boolean().optional(),
    }),
  )
  .min(ACTION_MENU_POLICY.minimumRadioOptions)
  .max(ACTION_MENU_POLICY.maximumRadioOptions)
  .refine(
    (options) => new Set(options.map((option) => option.value)).size === options.length,
    'Radio values must be unique.',
  )
  .readonly();
export const menuRadioSchema = z
  .strictObject({
    ...menuItemShape,
    type: z.literal('radio'),
    value: stateKeySchema,
    options: menuOptionsSchema,
    onValueChange: menuTextChangeSchema,
  })
  .refine(
    (item) => item.options.some((option) => option.value === item.value),
    'Selected radio value must identify an option.',
  );
export const menuLabelSchema = z.strictObject({
  type: z.literal('label'),
  key: stateKeySchema,
  label: labelSchema,
});
export const menuSeparatorSchema = z.strictObject({
  type: z.literal('separator'),
  key: stateKeySchema,
});
export const menuLeafSchema = z.discriminatedUnion('type', [
  menuActionSchema,
  menuLinkSchema,
  menuCheckboxSchema,
  menuRadioSchema,
  menuLabelSchema,
  menuSeparatorSchema,
]);
export const menuSubmenuSchema = z.strictObject({
  type: z.literal('submenu'),
  key: stateKeySchema,
  label: labelSchema,
  disabled: z.boolean().optional(),
  items: z
    .array(menuLeafSchema)
    .min(ACTION_MENU_POLICY.minimumSubmenuItems)
    .max(ACTION_MENU_POLICY.maximumSubmenuItems)
    .readonly(),
});
export const menuItemSchema = z.discriminatedUnion('type', [
  menuActionSchema,
  menuLinkSchema,
  menuCheckboxSchema,
  menuRadioSchema,
  menuLabelSchema,
  menuSeparatorSchema,
  menuSubmenuSchema,
]);

type MenuKey =
  | { key: string; type: 'submenu'; items: readonly { key: string }[] }
  | {
      key: string;
      type: 'action' | 'link' | 'checkbox' | 'radio' | 'label' | 'separator';
    };
export function validMenuKeys(items: readonly MenuKey[]): boolean {
  const all = items.flatMap((item) =>
    item.type === 'submenu' ? [item, ...item.items] : [item],
  );
  return (
    all.length <= ACTION_MENU_POLICY.maximumTotalItems && uniqueNavigationKeys(all)
  );
}
export const menuItemsSchema = z
  .array(menuItemSchema)
  .max(ACTION_MENU_POLICY.maximumItems)
  .refine(validMenuKeys, 'Menu keys must be globally unique within the item budget.')
  .readonly();
