import type { z } from 'zod';
import type { submitButtonSchema } from '../../schema/submit-button/index.js';

export type SubmitButtonProps = z.infer<typeof submitButtonSchema>;
