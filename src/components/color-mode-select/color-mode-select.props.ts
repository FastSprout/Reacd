import type { z } from 'zod';
import type { colorModeSelectSchema } from '../../schema/color-mode-select/index.js';

export type ColorModeSelectProps = z.infer<typeof colorModeSelectSchema>;
