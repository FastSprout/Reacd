import type { z } from 'zod';
import type { tooltipSchema } from '../../schema/tooltip/tooltip.schema.js';
export type TooltipProps = z.infer<typeof tooltipSchema>;
