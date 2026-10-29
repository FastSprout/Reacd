import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { PAGE_ORIENTATIONS } from '../../core/page-presentation-policy.js';
import {
  editorialShape,
  uniqueEditorialKeys,
  validEditorialEntry,
} from '../shared/editorial.js';
import { identifierSchema } from '../shared/identifier.js';
import { childrenSchema } from '../shared/children.js';

export const blogPostsItemSchema = z
  .strictObject({
    ...editorialShape,
    key: identifierSchema,
  })
  .refine(validEditorialEntry, 'Provide a named target and dated label.');

export const blogPostsSchema = z.strictObject({
  orientation: z.enum(PAGE_ORIENTATIONS).optional(),
  posts: z
    .array(blogPostsItemSchema)
    .max(DOCUMENT_POLICY.maxChildren)
    .refine(uniqueEditorialKeys, 'Editorial keys must be unique.')
    .readonly()
    .optional(),
  children: childrenSchema,
});
