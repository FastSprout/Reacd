import { z } from 'zod';
import { EDITORIAL_VARIANTS } from '../../core/editorial-policy.js';
import { PAGE_ORIENTATIONS } from '../../core/page-presentation-policy.js';
import { avatarSourceSchema } from '../avatar/avatar.schema.js';
import { childrenSchema } from './children.js';
import { labelSchema, textSchema } from './values.js';
import { pageTitleActionShape, validPageTitleAction } from './page-presentation.js';

export const editorialImageSchema = z.strictObject({
  src: avatarSourceSchema,
  alt: labelSchema,
});

export const editorialShape = {
  ...pageTitleActionShape,
  title: labelSchema.optional(),
  description: textSchema.optional(),
  date: z.iso.date().optional(),
  dateLabel: labelSchema.optional(),
  image: editorialImageSchema.optional(),
  orientation: z.enum(PAGE_ORIENTATIONS).optional(),
  variant: z.enum(EDITORIAL_VARIANTS).optional(),
  children: childrenSchema,
  header: childrenSchema,
  badge: childrenSchema,
  authors: childrenSchema,
  footer: childrenSchema,
  actions: childrenSchema,
};

export function validEditorialEntry(value: {
  title?: string | undefined;
  href?: string | undefined;
  onPress?: unknown;
  action?: string | undefined;
  newWindow?: boolean | undefined;
  date?: string | undefined;
  dateLabel?: string | undefined;
}): boolean {
  return (
    validPageTitleAction(value) &&
    (value.dateLabel === undefined || value.date !== undefined)
  );
}

export function uniqueEditorialKeys(entries: readonly { key: string }[]): boolean {
  return new Set(entries.map((entry) => entry.key)).size === entries.length;
}
