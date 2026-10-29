import type { z } from 'zod';
import type { marqueeSchema } from '../../schema/marquee/index.js';
export type MarqueeProps = z.infer<typeof marqueeSchema>;
