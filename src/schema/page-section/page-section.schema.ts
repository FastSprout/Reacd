import { identifierSchema, validPageAnchor } from '../shared/identifier.js';
import { z } from 'zod';
import { pageIntroductionShape, pageRegionShape } from '../shared/page-presentation.js';
import { childrenSchema } from '../shared/children.js';

export const pageSectionSchema = z
  .strictObject({
    anchor: identifierSchema.optional(),
    ...pageIntroductionShape,
    ...pageRegionShape,
    leading: childrenSchema,
    features: childrenSchema,
  })
  .refine(validPageAnchor, 'An anchor requires a named title.');
