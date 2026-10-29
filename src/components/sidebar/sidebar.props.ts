import type { z } from 'zod';
import type { sidebarSchema } from '../../schema/sidebar/sidebar.schema.js';

export type SidebarProps = z.infer<typeof sidebarSchema>;
