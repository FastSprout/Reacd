import type { z } from 'zod';
import type { buttonComponentSchema } from '../../schema/button/button.schema.js';

export type ButtonProps = z.infer<typeof buttonComponentSchema>;
