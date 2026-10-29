import { z } from 'zod';
import {
  pageLinkCollectionShape,
  validPageLinkCollection,
} from '../shared/page-links.js';
import { labelSchema } from '../shared/values.js';

export const pageLinksSchema = z
  .strictObject({
    ...pageLinkCollectionShape,
    title: labelSchema.optional(),
  })
  .refine(
    validPageLinkCollection,
    'Links need unique keys and an existing active key.',
  );
