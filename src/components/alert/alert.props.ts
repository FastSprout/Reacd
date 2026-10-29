import type { z } from 'zod';
import type { alertSchema } from '../../schema/alert/alert.schema.js';

export type AlertProps = z.infer<typeof alertSchema>;
