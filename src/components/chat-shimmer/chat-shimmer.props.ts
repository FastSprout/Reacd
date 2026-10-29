import type { z } from 'zod';
import type { chatShimmerSchema } from '../../schema/chat-shimmer/index.js';

export type ChatShimmerProps = z.infer<typeof chatShimmerSchema>;
