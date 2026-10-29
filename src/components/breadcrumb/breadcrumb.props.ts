import type { z } from 'zod';
import type { breadcrumbSchema } from '../../schema/breadcrumb/breadcrumb.schema.js';
export type BreadcrumbProps = z.infer<typeof breadcrumbSchema>;
