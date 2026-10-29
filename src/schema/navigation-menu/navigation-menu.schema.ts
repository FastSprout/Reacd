import { z } from 'zod';
import {
  NAVIGATION_COMPOSITION_POLICY,
  NAVIGATION_ORIENTATIONS,
} from '../../core/navigation-composition-policy.js';
import { labelSchema, pressSchema, textSchema } from '../shared/values.js';
import {
  navigationTargetShape,
  navigationTargetSchema,
  uniqueNavigationKeys,
  validNavigationTarget,
} from '../navigation-shared/target.schema.js';

export function validNavigationGroup(item: {
  href?: string | undefined;
  onPress?: unknown;
  action?: unknown;
  children?: readonly unknown[] | undefined;
  description?: string | undefined;
}): boolean {
  if (item.children === undefined) return item.description === undefined;
  return (
    item.href === undefined &&
    item.onPress === undefined &&
    item.action === undefined &&
    item.children.length > 0
  );
}

export const navigationMenuItemShape = {
  ...navigationTargetShape,
  description: textSchema.optional(),
  onPress: pressSchema.optional(),
  children: z
    .array(navigationTargetSchema)
    .min(NAVIGATION_COMPOSITION_POLICY.minimumLinks)
    .max(NAVIGATION_COMPOSITION_POLICY.maximumLinks)
    .refine(uniqueNavigationKeys, 'Child keys must be unique.')
    .readonly()
    .optional(),
};

export const navigationMenuItemSchema = z
  .strictObject(navigationMenuItemShape)
  .refine(validNavigationTarget, 'Choose a link or an action.')
  .refine(validNavigationGroup, 'A group cannot also declare a target.');

export const navigationMenuSchema = z.strictObject({
  label: labelSchema,
  orientation: z.enum(NAVIGATION_ORIENTATIONS).optional(),
  items: z
    .array(navigationMenuItemSchema)
    .max(NAVIGATION_COMPOSITION_POLICY.maximumLinks)
    .refine(uniqueNavigationKeys, 'Item keys must be unique.')
    .readonly(),
});
