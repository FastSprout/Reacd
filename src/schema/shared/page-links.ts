import { z } from 'zod';
import { CONTENT_POLICY } from '../../core/policy.js';
import { identifierSchema } from './identifier.js';
import { childrenSchema } from './children.js';
import { labelSchema } from './values.js';
import { linkSchema } from '../link/link.schema.js';

export const pageLinkItemSchema = z.strictObject({
  key: identifierSchema,
  label: labelSchema,
  href: linkSchema.shape.href,
  leading: childrenSchema,
  newWindow: z.boolean().optional(),
});

export const pageLinkCollectionShape = {
  label: labelSchema,
  activeKey: identifierSchema.optional(),
  links: z
    .array(pageLinkItemSchema)
    .max(CONTENT_POLICY.maxOptions)
    .readonly()
    .optional(),
};

export function validPageLinkCollection(value: {
  links?: readonly { key: string }[] | undefined;
  activeKey?: string | undefined;
}): boolean {
  const keys = value.links?.map((item) => item.key) ?? [];
  return (
    new Set(keys).size === keys.length &&
    (value.activeKey === undefined || keys.includes(value.activeKey))
  );
}
