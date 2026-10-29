import { z } from 'zod';
import {
  NAVIGATION_COMPOSITION_POLICY,
} from '../../core/navigation-composition-policy.js';
import {
  navigationMenuSchema,
  validNavigationGroup,
} from './navigation-menu.schema.js';
import { textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';
import {
  navigationTargetShape,
  navigationTransportTargetSchema,
  uniqueNavigationKeys,
  validNavigationTarget,
} from '../navigation-shared/target.schema.js';

const item = z
  .strictObject({
    ...navigationTargetShape,
    description: textSchema.optional(),
    action: stateKeySchema.optional(),
    children: z
      .array(navigationTransportTargetSchema)
      .min(NAVIGATION_COMPOSITION_POLICY.minimumLinks)
      .max(NAVIGATION_COMPOSITION_POLICY.maximumLinks)
      .refine(uniqueNavigationKeys, 'Child keys must be unique.')
      .readonly()
      .optional(),
  })
  .refine(validNavigationTarget, 'Choose a link or an action.')
  .refine(validNavigationGroup, 'A group cannot also declare a target.');

export const navigationMenuNodeSchema = z.strictObject({
  ...navigationMenuSchema.shape,
  type: z.literal('NavigationMenu'),
  items: z
    .array(item)
    .max(NAVIGATION_COMPOSITION_POLICY.maximumLinks)
    .refine(uniqueNavigationKeys, 'Item keys must be unique.')
    .readonly(),
});
