import type { z } from 'zod';
import type { pageHeaderSchema } from '../../schema/page-header/page-header.schema.js';

export type PageHeaderProps = z.infer<typeof pageHeaderSchema>;
