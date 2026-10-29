import { z } from 'zod';
import {
  PAGE_SURFACE_INTENTS,
  PAGE_SURFACE_VARIANTS,
} from '../../core/page-presentation-policy.js';
import { childrenSchema } from '../shared/children.js';
import { validPageTitleAction } from '../shared/page-presentation.js';
import { pageFeatureSchema } from '../page-feature/page-feature.schema.js';

export const pageCardSchema = z
  .strictObject({
    ...pageFeatureSchema.shape,
    header: childrenSchema,
    footer: childrenSchema,
    reverse: z.boolean().optional(),
    variant: z.enum(PAGE_SURFACE_VARIANTS).optional(),
    intent: z.enum(PAGE_SURFACE_INTENTS).optional(),
    highlight: z.boolean().optional(),
    spotlight: z.boolean().optional(),
  })
  .refine(validPageTitleAction, 'Provide a named link or action, never both.');
