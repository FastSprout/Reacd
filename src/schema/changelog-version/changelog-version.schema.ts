import { z } from 'zod';
import { editorialShape, validEditorialEntry } from '../shared/editorial.js';

export const changelogVersionSchema = z
  .strictObject({
    ...editorialShape,
    indicator: z.boolean().optional(),
  })
  .refine(validEditorialEntry, 'Provide a named target and dated label.');
