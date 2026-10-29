import { z } from 'zod';
import { userContentSchema } from './user.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const userNodeSchema = userContentSchema
  .extend({
    type: z.literal('User'),
    action: stateKeySchema.optional(),
    disabled: z.boolean().optional(),
  })
  .refine(
    (node) => node.href === undefined || node.action === undefined,
    'User supports either a link or an action.',
  )
  .refine(
    (node) => node.disabled === undefined || node.action !== undefined,
    'Disabled User requires an action.',
  );
export type UserNode = z.infer<typeof userNodeSchema>;
