import type { z } from 'zod';
import type { gridSchema } from '../../schema/grid/grid.schema.js';

export type GridProps = z.infer<typeof gridSchema>;
