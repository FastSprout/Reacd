import type { z } from 'zod';
import type { toolbarSchema } from '../../schema/toolbar/toolbar.schema.js';

export type ToolbarProps = z.infer<typeof toolbarSchema>;
