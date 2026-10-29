import type { z } from 'zod';
import type { pageAsideSchema } from '../../schema/page-aside/page-aside.schema.js';

export type PageAsideProps = z.infer<typeof pageAsideSchema>;
