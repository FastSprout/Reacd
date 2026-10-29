import type { z } from 'zod';
import type { formFieldSchema } from '../../schema/form-field/index.js';

export type FormFieldProps = z.infer<typeof formFieldSchema>;
