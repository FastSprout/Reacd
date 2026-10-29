import type { z } from 'zod';
import type { colorPickerSchema } from '../../schema/color-picker/index.js';
export type ColorPickerProps = z.infer<typeof colorPickerSchema>;
