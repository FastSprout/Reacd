import type { z } from 'zod';
import type { colorModeButtonSchema } from '../../schema/color-mode-button/index.js';

export type ColorModeButtonProps = z.infer<typeof colorModeButtonSchema>;
