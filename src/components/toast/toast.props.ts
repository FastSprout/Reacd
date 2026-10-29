import type { z } from 'zod';
import type { toastSchema } from '../../schema/toast/toast.schema.js';
export type ToastProps = z.infer<typeof toastSchema>;
