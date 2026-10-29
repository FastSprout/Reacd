import type { z } from 'zod';
import type { checkboxGroupSchema } from '../../schema/checkbox-group/index.js';
export type CheckboxGroupProps = z.infer<typeof checkboxGroupSchema>;
