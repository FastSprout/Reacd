import type { z } from 'zod';
import type { treeSchema } from '../../schema/tree/tree.schema.js';
export type TreeProps = z.infer<typeof treeSchema>;
