import { z } from 'zod';
import { labelSchema } from '../shared/values.js';

export const spinnerSchema = z.strictObject({ label: labelSchema });
