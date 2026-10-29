import type { z } from 'zod';
import type {
  contextMenuSchema,
} from '../../schema/context-menu/context-menu.schema.js';
export type ContextMenuProps = z.infer<typeof contextMenuSchema>;
