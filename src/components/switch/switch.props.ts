import type { z } from 'zod';
import type { switchSchema } from '../../schema/switch/index.js';

export type SwitchProps = z.infer<typeof switchSchema>;
