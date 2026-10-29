import type { z } from 'zod';
import type { colorModeAvatarSchema } from '../../schema/color-mode-avatar/index.js';

export type ColorModeAvatarProps = z.infer<typeof colorModeAvatarSchema>;
