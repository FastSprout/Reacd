import type { z } from 'zod';
import type { chatPaletteSchema } from '../../schema/chat-palette/index.js';

export type ChatPaletteProps = z.infer<typeof chatPaletteSchema>;
