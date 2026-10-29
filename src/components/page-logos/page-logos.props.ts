import type { z } from 'zod';
import type { pageLogosSchema } from '../../schema/page-logos/page-logos.schema.js';

export type PageLogosProps = z.infer<typeof pageLogosSchema>;
