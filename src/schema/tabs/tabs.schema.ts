import { z } from 'zod';
import { CONTENT_POLICY } from '../../core/policy.js';
import { TAB_ACTIVATION_MODES, TAB_ORIENTATIONS } from '../../core/tabs-policy.js';
import { childrenSchema } from '../shared/children.js';
import { labelSchema, textChangeSchema } from '../shared/values.js';

export const tabItemSchema = z.strictObject({
  value: labelSchema,
  label: labelSchema,
  disabled: z.boolean().optional(),
  content: childrenSchema,
});

export const tabItemsSchema = z
  .array(tabItemSchema)
  .min(1)
  .max(CONTENT_POLICY.maxOptions)
  .refine(
    (items) => new Set(items.map((item) => item.value)).size === items.length,
    'Tab values must be unique.',
  );

export function enabledTabValue(
  items: readonly { value: string; disabled?: boolean | undefined }[],
  value: string,
): boolean {
  return items.some((item) => item.value === value && !item.disabled);
}

export const tabsSchema = z
  .strictObject({
    children: childrenSchema,
    label: labelSchema,
    value: labelSchema,
    items: tabItemsSchema,
    onValueChange: textChangeSchema,
    orientation: z.enum(TAB_ORIENTATIONS).optional(),
    activationMode: z.enum(TAB_ACTIVATION_MODES).optional(),
  })
  .refine(
    ({ items, value }) => enabledTabValue(items, value),
    'Selected tab must exist and be enabled.',
  );
