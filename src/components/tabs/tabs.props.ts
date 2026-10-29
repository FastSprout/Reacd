import type { z } from 'zod';
import type { tabsSchema } from '../../schema/tabs/tabs.schema.js';

export type TabsProps = z.infer<typeof tabsSchema>;
