import type { z } from 'zod';
import type { selectMenuSchema } from '../../schema/select-menu/index.js';

export type SelectMenuProps = z.infer<typeof selectMenuSchema>;
