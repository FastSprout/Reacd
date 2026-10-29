import type { z } from 'zod';
import type { userSchema } from '../../schema/user/user.schema.js';
export type UserProps = z.infer<typeof userSchema>;
