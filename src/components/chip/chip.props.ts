import type { z } from 'zod';
import type { chipSchema } from '../../schema/chip/chip.schema.js';
export type ChipProps = z.infer<typeof chipSchema>;
