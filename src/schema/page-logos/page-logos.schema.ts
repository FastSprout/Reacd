import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { avatarSourceSchema } from '../avatar/avatar.schema.js';
import { identifierSchema } from '../shared/identifier.js';
import { labelSchema } from '../shared/values.js';

export const pageLogoSchema = z.strictObject({
  key: identifierSchema,
  src: avatarSourceSchema,
  alt: labelSchema,
});
export const pageLogosSchema = z.strictObject({
  label: labelSchema,
  title: labelSchema.optional(),
  emptyLabel: labelSchema.optional(),
  items: z
    .array(pageLogoSchema)
    .max(DOCUMENT_POLICY.maxChildren)
    .refine(
      (items) => new Set(items.map((item) => item.key)).size === items.length,
      'Logo keys must be unique.',
    )
    .readonly(),
});
