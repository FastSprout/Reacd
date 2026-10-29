import type { z } from 'zod';
import type { collapsibleSchema } from '../../schema/collapsible/collapsible.schema.js';
export type CollapsibleProps = z.infer<typeof collapsibleSchema>;
