import type { z } from 'zod';
import type { navigationSchema } from '../../schema/navigation/navigation.schema.js';

export type NavigationProps = z.infer<typeof navigationSchema>;
