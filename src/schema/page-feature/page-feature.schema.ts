import { z } from 'zod';
import {
  pageTitleActionShape,
  validPageTitleAction,
} from '../shared/page-presentation.js';
import { PAGE_ORIENTATIONS } from '../../core/page-presentation-policy.js';
import { childrenSchema } from '../shared/children.js';
import { labelSchema, textSchema } from '../shared/values.js';

export const pageFeatureSchema = z
  .strictObject({
    ...pageTitleActionShape,
    title: labelSchema.optional(),
    description: textSchema.optional(),
    children: childrenSchema,
    leading: childrenSchema,
    orientation: z.enum(PAGE_ORIENTATIONS).optional(),
  })
  .refine(validPageTitleAction, 'Provide a named link or action, never both.');
