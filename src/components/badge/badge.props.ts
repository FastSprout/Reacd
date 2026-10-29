import type { z } from 'zod';
import type { badgeSchema } from '../../schema/badge/badge.schema.js';

export type BadgeProps = z.infer<typeof badgeSchema>;
