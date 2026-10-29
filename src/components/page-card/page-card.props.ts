import type { z } from 'zod';
import type { pageCardSchema } from '../../schema/page-card/page-card.schema.js';

export type PageCardProps = z.infer<typeof pageCardSchema>;
