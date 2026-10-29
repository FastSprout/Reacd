import type { z } from 'zod';
import type {
  dropdownMenuSchema,
} from '../../schema/dropdown-menu/dropdown-menu.schema.js';
export type DropdownMenuProps = z.infer<typeof dropdownMenuSchema>;
