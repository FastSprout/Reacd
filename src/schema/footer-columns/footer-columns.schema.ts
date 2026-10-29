import { z } from 'zod';
import {
  NAVIGATION_COMPOSITION_POLICY,
} from '../../core/navigation-composition-policy.js';
import { childrenSchema } from '../shared/children.js';
import { labelSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';
import {
  navigationTargetSchema,
  uniqueNavigationKeys,
} from '../navigation-shared/target.schema.js';

export const footerColumnsSchema = z.strictObject({
  label: labelSchema,
  columns: z
    .array(
      z.strictObject({
        key: stateKeySchema,
        label: labelSchema,
        children: z
          .array(navigationTargetSchema)
          .max(NAVIGATION_COMPOSITION_POLICY.maximumLinks)
          .refine(uniqueNavigationKeys, 'Link keys must be unique.')
          .readonly(),
      }),
    )
    .max(NAVIGATION_COMPOSITION_POLICY.maximumColumns)
    .refine(uniqueNavigationKeys, 'Column keys must be unique.')
    .readonly(),
  left: childrenSchema,
  right: childrenSchema,
});
