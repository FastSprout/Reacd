import type { z } from 'zod';
import type {
  contentSearchButtonSchema,
} from '../../schema/content-search-button/index.js';

export type ContentSearchButtonProps = z.infer<typeof contentSearchButtonSchema>;
