import type { z } from 'zod';
import type { authFormSchema } from '../../schema/auth-form/auth-form.schema.js';

export type AuthFormProps = z.infer<typeof authFormSchema>;
