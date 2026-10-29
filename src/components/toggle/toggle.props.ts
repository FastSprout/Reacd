import type { z } from 'zod';
import type { toggleSchema } from '../../schema/toggle/toggle.schema.js';

export type ToggleProps = z.infer<typeof toggleSchema>;
