import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import {
  editorialShape,
  uniqueEditorialKeys,
  validEditorialEntry,
} from '../shared/editorial.js';
import { identifierSchema } from '../shared/identifier.js';
import { childrenSchema } from '../shared/children.js';

export const changelogVersionsItemSchema = z
  .strictObject({
    ...editorialShape,
    key: identifierSchema,
    indicator: z.boolean().optional(),
  })
  .refine(validEditorialEntry, 'Provide a named target and dated label.');

export const changelogVersionsSchema = z.strictObject({
  versions: z
    .array(changelogVersionsItemSchema)
    .max(DOCUMENT_POLICY.maxChildren)
    .refine(uniqueEditorialKeys, 'Editorial keys must be unique.')
    .readonly()
    .optional(),
  indicator: z.boolean().optional(),
  children: childrenSchema,
});
