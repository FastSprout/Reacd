import type { z } from 'zod';
import type { inputMenuSchema } from '../../schema/input-menu/index.js';

export type InputMenuProps = z.infer<typeof inputMenuSchema>;
