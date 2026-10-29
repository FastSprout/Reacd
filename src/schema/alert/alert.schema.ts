import { z } from 'zod';
import { ALERT_INTENTS, BUTTON_INTENTS } from '../../core/policy.js';
import { ELEMENT_POLICY } from '../../core/element-policy.js';
import {
  labelSchema,
  textSchema,
  booleanChangeSchema,
  pressSchema,
} from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { iconNameSchema } from '../icon/index.js';

export const alertActionSchema = z.strictObject({
  id: stateKeySchema,
  label: labelSchema,
  onPress: pressSchema,
  intent: z.enum(BUTTON_INTENTS).optional(),
  disabled: z.boolean().optional(),
});

export const alertSchema = z
  .strictObject({
    title: labelSchema,
    message: textSchema,
    intent: z.enum(ALERT_INTENTS),
    icon: iconNameSchema.optional(),
    open: z.boolean().optional(),
    onOpenChange: booleanChangeSchema.optional(),
    closeLabel: labelSchema.optional(),
    actions: z
      .array(alertActionSchema)
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
    (properties) =>
      (properties.onOpenChange === undefined || properties.open !== undefined) &&
      (properties.closeLabel === undefined || properties.onOpenChange !== undefined),
    'Dismissal requires controlled visibility and a change callback.',
  );
