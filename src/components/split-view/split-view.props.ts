import type { z } from 'zod';
import type { splitViewSchema } from '../../schema/split-view/split-view.schema.js';

export type SplitViewProps = z.infer<typeof splitViewSchema>;
