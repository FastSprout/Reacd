import type { z } from 'zod';
import type { timelineSchema } from '../../schema/timeline/timeline.schema.js';
export type TimelineProps = z.infer<typeof timelineSchema>;
