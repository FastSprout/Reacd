import type { z } from 'zod';
import type { slideoverSchema } from '../../schema/slideover/slideover.schema.js';
export type SlideoverProps = z.infer<typeof slideoverSchema>;
