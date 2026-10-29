import type { z } from 'zod';
import type { checkboxSchema } from '../../schema/checkbox/checkbox.schema.js';

export type CheckboxProps = z.infer<typeof checkboxSchema>;
