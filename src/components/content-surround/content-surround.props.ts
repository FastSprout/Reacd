import type { z } from 'zod';
import type { contentSurroundSchema } from '../../schema/content-surround/index.js';

export type ContentSurroundProps = z.infer<typeof contentSurroundSchema>;
