import type { z } from 'zod';
import type { pageLinksSchema } from '../../schema/page-links/page-links.schema.js';

export type PageLinksProps = z.infer<typeof pageLinksSchema>;
