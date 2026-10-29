import type { z } from 'zod';
import type { scrollAreaSchema } from '../../schema/scroll-area/index.js';
export type ScrollAreaProps = z.infer<typeof scrollAreaSchema>;
