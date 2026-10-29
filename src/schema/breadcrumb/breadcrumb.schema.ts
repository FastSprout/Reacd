import { z } from 'zod';
import {
  BREADCRUMB_POLICY,
  BREADCRUMB_SEPARATORS,
} from '../../core/breadcrumb-policy.js';
import { labelSchema, pressSchema } from '../shared/values.js';
import { linkSchema } from '../link/link.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';
export const breadcrumbItemShape = {
  key: stateKeySchema,
  label: labelSchema,
  href: linkSchema.shape.href.optional(),
  disabled: z.boolean().optional(),
};
export function validBreadcrumbTarget(
  href: string | undefined,
  action: unknown,
): boolean {
  return href === undefined || action === undefined;
}
export const breadcrumbItemSchema = z
  .strictObject({
    ...breadcrumbItemShape,
    onPress: pressSchema.optional(),
  })
  .refine(
    (item) => validBreadcrumbTarget(item.href, item.onPress),
    'Choose a link or an action, not both.',
  );
export function uniqueBreadcrumbKeys(items: readonly { key: string }[]): boolean {
  return new Set(items.map((item) => item.key)).size === items.length;
}
export const breadcrumbSchema = z.strictObject({
  label: labelSchema,
  separator: z.enum(BREADCRUMB_SEPARATORS).optional(),
  items: z
    .array(breadcrumbItemSchema)
    .min(BREADCRUMB_POLICY.minimumItems)
    .max(BREADCRUMB_POLICY.maximumItems)
    .refine(uniqueBreadcrumbKeys, 'Breadcrumb keys must be unique.')
    .readonly(),
});
