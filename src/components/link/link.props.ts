import type { z } from 'zod';
import type { linkSchema } from '../../schema/link/link.schema.js';

export type LinkProps = z.infer<typeof linkSchema>;
