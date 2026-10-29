import { z } from 'zod';
import { labelSchema, pressSchema } from '../shared/values.js';
import { linkSchema } from '../link/link.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const navigationTargetShape = {
  key: stateKeySchema,
  label: labelSchema,
  href: linkSchema.shape.href.optional(),
  disabled: z.boolean().optional(),
  active: z.boolean().optional(),
  newWindow: z.boolean().optional(),
};

export function validNavigationTarget(item: {
  href?: string | undefined;
  onPress?: unknown;
  action?: unknown;
  newWindow?: boolean | undefined;
}): boolean {
  return (
    !(
      item.href !== undefined &&
      (item.onPress !== undefined || item.action !== undefined)
    ) &&
    (!item.newWindow || item.href !== undefined)
  );
}

export function uniqueNavigationKeys(items: readonly { key: string }[]): boolean {
  return new Set(items.map((item) => item.key)).size === items.length;
}

export const navigationTargetSchema = z
  .strictObject({
    ...navigationTargetShape,
    onPress: pressSchema.optional(),
  })
  .refine(
    validNavigationTarget,
    'A target must be an unambiguous safe link or action.',
  );

export const navigationTransportTargetSchema = z
  .strictObject({
    ...navigationTargetShape,
    action: stateKeySchema.optional(),
  })
  .refine(
    validNavigationTarget,
    'A target must be an unambiguous safe link or action.',
  );
