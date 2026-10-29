import type { z } from 'zod';
import type {
  commandPaletteSchema,
} from '../../schema/command-palette/command-palette.schema.js';
export type CommandPaletteProps = z.infer<typeof commandPaletteSchema>;
