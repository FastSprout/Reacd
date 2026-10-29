import type { z } from 'zod';
import type { themeSchema } from '../../schema/theme/theme.schema.js';

export type ThemeProps = z.infer<typeof themeSchema>;
