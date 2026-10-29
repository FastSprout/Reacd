import { z } from 'zod';
import { contentNavigationContentSchema } from './content-navigation.schema.js';
import { stateBindingSchema } from '../state/binding.schema.js';

export const contentNavigationNodeSchema = contentNavigationContentSchema.extend({
  type: z.literal('ContentNavigation'),
  currentKey: stateBindingSchema,
  expandedKeys: stateBindingSchema,
});
export type ContentNavigationNode = z.infer<typeof contentNavigationNodeSchema>;
