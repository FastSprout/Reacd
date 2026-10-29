import type { z } from 'zod';
import type { inputTimeSchema } from '../../schema/input-time/index.js';

export type InputTimeProps = z.infer<typeof inputTimeSchema>;
