import { z } from 'zod';
import { PAGE_ORIENTATIONS } from '../../core/page-presentation-policy.js';
import { childrenSchema } from './children.js';
import { labelSchema, pressSchema, textSchema } from './values.js';
import { linkSchema } from '../link/link.schema.js';

export const pageIntroductionShape = {
  title: labelSchema.optional(),
  description: textSchema.optional(),
  headline: labelSchema.optional(),
  children: childrenSchema,
  links: childrenSchema,
};

export const pageRegionShape = {
  orientation: z.enum(PAGE_ORIENTATIONS).optional(),
  reverse: z.boolean().optional(),
  header: childrenSchema,
  footer: childrenSchema,
  top: childrenSchema,
  bottom: childrenSchema,
};

export const pageTitleActionShape = {
  href: linkSchema.shape.href.optional(),
  onPress: pressSchema.optional(),
  newWindow: z.boolean().optional(),
};

export function validPageTitleAction(value: {
  title?: string | undefined;
  href?: string | undefined;
  onPress?: unknown;
  action?: string | undefined;
  newWindow?: boolean | undefined;
}): boolean {
  const action = value.onPress !== undefined || value.action !== undefined;
  if (action && value.href !== undefined) return false;
  if ((action || value.href !== undefined) && value.title === undefined) return false;
  return value.newWindow !== true || value.href !== undefined;
}
