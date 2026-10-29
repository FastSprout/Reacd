import { z } from 'zod';
import { LISTBOX_MODES } from '../../core/listbox-policy.js';
import { stateBindingSchema } from '../state/binding.schema.js';
import { listboxProperties } from './properties.schema.js';

export const listboxNodeSchema = z.strictObject({
  ...listboxProperties,
  type: z.literal('Listbox'),
  mode: z.enum(LISTBOX_MODES).optional(),
  value: stateBindingSchema,
});
export type ListboxNode = z.infer<typeof listboxNodeSchema>;
