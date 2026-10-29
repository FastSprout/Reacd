import type { z } from 'zod';
import type {
  navigationMenuSchema,
} from '../../schema/navigation-menu/navigation-menu.schema.js';
export type NavigationMenuProps = z.infer<typeof navigationMenuSchema>;
