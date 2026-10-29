import { z } from 'zod';
import { BUTTON_INTENTS, DOCUMENT_POLICY } from '../../core/policy.js';
import { childrenSchema } from '../shared/children.js';
import { identifierSchema } from '../shared/identifier.js';
import { labelSchema, pressSchema } from '../shared/values.js';

export const authProviderSchema = z.strictObject({
  key: identifierSchema,
  label: labelSchema,
  onPress: pressSchema,
  intent: z.enum(BUTTON_INTENTS).optional(),
  disabled: z.boolean().optional(),
});

export function uniqueAuthProviders(items: readonly { key: string }[]): boolean {
  return new Set(items.map((item) => item.key)).size === items.length;
}

export const authFormShape = {
  label: labelSchema,
  submitLabel: labelSchema,
  title: labelSchema.optional(),
  description: labelSchema.optional(),
  leading: childrenSchema,
  header: childrenSchema,
  children: childrenSchema,
  footer: childrenSchema,
  separatorLabel: labelSchema.optional(),
  loadingLabel: labelSchema.optional(),
  error: labelSchema.optional(),
  loading: z.boolean().optional(),
  disabled: z.boolean().optional(),
};

export const authFormSchema = z.strictObject({
  ...authFormShape,
  onSubmit: pressSchema,
  providers: z
    .array(authProviderSchema)
    .max(DOCUMENT_POLICY.maxChildren)
    .refine(uniqueAuthProviders, 'Provider keys must be unique.')
    .readonly()
    .optional(),
});
