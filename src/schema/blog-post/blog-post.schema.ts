import { z } from 'zod';
import { editorialShape, validEditorialEntry } from '../shared/editorial.js';

export const blogPostSchema = z
  .strictObject(editorialShape)
  .refine(validEditorialEntry, 'Provide a named target and dated label.');
