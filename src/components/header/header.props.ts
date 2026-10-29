import type { z } from 'zod';
import type { headerSchema } from '../../schema/header/header.schema.js';

export type HeaderProps = z.infer<typeof headerSchema>;
