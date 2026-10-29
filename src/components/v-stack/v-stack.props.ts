import type { z } from 'zod';
import type { vStackSchema } from '../../schema/v-stack/v-stack.schema.js';

export type VStackProps = z.infer<typeof vStackSchema>;
