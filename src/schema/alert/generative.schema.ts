import { z } from 'zod';
import { ELEMENT_POLICY } from '../../core/element-policy.js';
import { alertSchema, alertActionSchema } from './alert.schema.js';
import { stateBindingSchema } from '../state/binding.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';

const { onOpenChange: _change, actions: _actions, ...content } = alertSchema.shape;
export const alertNodeSchema = z
  .strictObject({
    ...content,
    type: z.literal('Alert'),
    open: z.union([z.boolean(), stateBindingSchema]).optional(),
    actions: z
      .array(
        alertActionSchema.omit({ onPress: true }).extend({ action: stateKeySchema }),
      )
      .max(ELEMENT_POLICY.maxAlertActions)
      .refine(
        (actions) =>
          new Set(actions.map((action) => action.id)).size === actions.length,
        'Alert action identifiers must be unique.',
      )
      .readonly()
      .optional(),
  })
  .refine(
    (node) =>
      node.closeLabel === undefined ||
      (typeof node.open === 'object' && node.open.mode === 'readWrite'),
    'A close label requires writable visibility.',
  );
export type AlertNodeDeclaration = z.infer<typeof alertNodeSchema>;
