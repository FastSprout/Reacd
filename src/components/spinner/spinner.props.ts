import type { z } from 'zod';
import type { spinnerSchema } from '../../schema/spinner/spinner.schema.js';

export type SpinnerProps = z.infer<typeof spinnerSchema>;
