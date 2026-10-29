import type { z } from 'zod';
import type { popoverSchema } from '../../schema/popover/popover.schema.js';
export type PopoverProps = z.infer<typeof popoverSchema>;
