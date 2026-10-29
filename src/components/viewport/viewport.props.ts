import type { z } from 'zod';
import type { viewportSchema } from '../../schema/viewport/viewport.schema.js';

export type ViewportProps = z.infer<typeof viewportSchema>;
