import { z } from 'zod';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { childrenSchema } from '../shared/children.js';
import { labelSchema } from '../shared/values.js';

export const collapsibleSchema = z.strictObject({
  label: labelSchema,
  open: z.boolean(),
  onOpenChange: z.custom<(open: boolean) => void>(
    (value) => typeof value === 'function',
    FRAMEWORK_ERRORS.invalidCallback,
  ),
  children: childrenSchema,
  disabled: z.boolean().optional(),
  retainContent: z.boolean().optional(),
  showTrigger: z.boolean().optional(),
});
