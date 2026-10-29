import type { z } from 'zod';
import type { colorModeImageSchema } from '../../schema/color-mode-image/index.js';

export type ColorModeImageProps = z.infer<typeof colorModeImageSchema>;
