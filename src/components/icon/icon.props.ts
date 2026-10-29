import type { z } from 'zod';
import type { iconSchema } from '../../schema/icon/index.js';
export type IconProps = z.infer<typeof iconSchema>;
