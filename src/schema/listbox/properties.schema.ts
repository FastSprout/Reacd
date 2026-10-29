import { z } from 'zod';
import { LISTBOX_LOCALES, LISTBOX_STATUSES } from '../../core/listbox-policy.js';
import { selectionOptionsSchema } from '../selection/index.js';
import { labelSchema, textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const listboxProperties = {
  label: labelSchema,
  items: selectionOptionsSchema,
  description: textSchema.optional(),
  name: stateKeySchema.optional(),
  locale: z.enum(LISTBOX_LOCALES).optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  status: z.enum(LISTBOX_STATUSES).optional(),
  emptyMessage: labelSchema.optional(),
  loadingMessage: labelSchema.optional(),
  errorMessage: labelSchema.optional(),
  clearLabel: labelSchema.optional(),
};
