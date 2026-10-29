import type { z } from 'zod';
import type { splitterSchema } from '../../schema/splitter/splitter.schema.js';

export type SplitterProps = z.input<typeof splitterSchema>;
