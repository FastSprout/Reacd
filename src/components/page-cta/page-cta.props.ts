import type { z } from 'zod';
import type { pageCTASchema } from '../../schema/page-cta/page-cta.schema.js';

export type PageCTAProps = z.infer<typeof pageCTASchema>;
