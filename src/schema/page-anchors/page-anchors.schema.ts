import { z } from 'zod';
import {
  pageLinkCollectionShape,
  validPageLinkCollection,
} from '../shared/page-links.js';

export const pageAnchorsSchema = z
  .strictObject(pageLinkCollectionShape)
  .refine(
    validPageLinkCollection,
    'Links need unique keys and an existing active key.',
  );
