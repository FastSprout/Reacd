import type { z } from 'zod';
import type { fieldGroupSchema } from '../../schema/field-group/index.js';

export type FieldGroupProps = z.infer<typeof fieldGroupSchema>;
