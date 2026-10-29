import { z } from 'zod';
import { BREADCRUMB_POLICY } from '../../core/breadcrumb-policy.js';
import { stateKeySchema } from '../state/shared/definition.js';
import {
  breadcrumbSchema,
  breadcrumbItemShape,
  uniqueBreadcrumbKeys,
  validBreadcrumbTarget,
} from './breadcrumb.schema.js';
const itemSchema = z
  .strictObject({
    ...breadcrumbItemShape,
    action: stateKeySchema.optional(),
  })
  .refine(
    (item) => validBreadcrumbTarget(item.href, item.action),
    'Choose a link or an action, not both.',
  );
export const breadcrumbNodeSchema = z.strictObject({
  ...breadcrumbSchema.shape,
  type: z.literal('Breadcrumb'),
  items: z
    .array(itemSchema)
    .min(BREADCRUMB_POLICY.minimumItems)
    .max(BREADCRUMB_POLICY.maximumItems)
    .refine(uniqueBreadcrumbKeys, 'Breadcrumb keys must be unique.')
    .readonly(),
});
