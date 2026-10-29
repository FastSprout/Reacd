import type { z } from 'zod';
import type { contentTocSchema } from '../../schema/content-toc/index.js';

export type ContentTocProps = z.infer<typeof contentTocSchema>;
