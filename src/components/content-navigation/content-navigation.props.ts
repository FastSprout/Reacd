import type { z } from 'zod';
import type { contentNavigationSchema } from '../../schema/content-navigation/index.js';

export type ContentNavigationProps = z.infer<typeof contentNavigationSchema>;
