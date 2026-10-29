import { identifierSchema, validPageAnchor } from '../shared/identifier.js';
import { z } from 'zod';
import { pageIntroductionShape } from '../shared/page-presentation.js';

export const pageHeaderSchema = z
  .strictObject({
    ...pageIntroductionShape,
    anchor: identifierSchema.optional(),
  })
  .refine(validPageAnchor, 'An anchor requires a named title.');
