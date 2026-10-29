import type { z } from 'zod';
import type { colorModeSwitchSchema } from '../../schema/color-mode-switch/index.js';

export type ColorModeSwitchProps = z.infer<typeof colorModeSwitchSchema>;
