import { z } from 'zod';
import { ACTION_MENU_POLICY } from '../../core/action-menu-policy.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { stateBindingSchema } from '../state/binding.schema.js';
import {
  menuActionSchema,
  menuLinkSchema,
  menuCheckboxSchema,
  menuRadioSchema,
  menuLabelSchema,
  menuSeparatorSchema,
  menuSubmenuSchema,
  validMenuKeys,
} from './items.schema.js';

const { onPress: _press, ...action } = menuActionSchema.shape;
const { onCheckedChange: _check, ...checkbox } = menuCheckboxSchema.shape;
const { onValueChange: _radio, ...radio } = menuRadioSchema.shape;
const actionSchema = z.strictObject({ ...action, action: stateKeySchema });
const checkboxSchema = z.strictObject({ ...checkbox, checked: stateBindingSchema });
const radioSchema = z.strictObject({ ...radio, value: stateBindingSchema });
const menuLeafNodeSchema = z.discriminatedUnion('type', [
  actionSchema,
  menuLinkSchema,
  checkboxSchema,
  radioSchema,
  menuLabelSchema,
  menuSeparatorSchema,
]);
const submenuSchema = z.strictObject({
  ...menuSubmenuSchema.shape,
  items: z
    .array(menuLeafNodeSchema)
    .min(ACTION_MENU_POLICY.minimumSubmenuItems)
    .max(ACTION_MENU_POLICY.maximumSubmenuItems)
    .readonly(),
});
export const menuNodeItemsSchema = z
  .array(
    z.discriminatedUnion('type', [
      actionSchema,
      menuLinkSchema,
      checkboxSchema,
      radioSchema,
      menuLabelSchema,
      menuSeparatorSchema,
      submenuSchema,
    ]),
  )
  .max(ACTION_MENU_POLICY.maximumItems)
  .refine(validMenuKeys, 'Menu keys must be globally unique within the item budget.')
  .readonly();
export type MenuNodeItems = z.infer<typeof menuNodeItemsSchema>;
