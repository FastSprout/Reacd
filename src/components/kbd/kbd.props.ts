import type { z } from 'zod';
import type { kbdSchema } from '../../schema/kbd/kbd.schema.js';
export type KbdProps = z.infer<typeof kbdSchema>;
