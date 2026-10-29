import type { z } from 'zod';
import type { drawerSchema } from '../../schema/drawer/drawer.schema.js';
export type DrawerProps = z.infer<typeof drawerSchema>;
