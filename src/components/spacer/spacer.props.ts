import type { z } from 'zod';
import type { spacerSchema } from '../../schema/spacer/spacer.schema.js';

export type SpacerProps = z.infer<typeof spacerSchema>;
