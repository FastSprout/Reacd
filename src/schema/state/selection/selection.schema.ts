import { z } from 'zod';
import { STATE_POLICY } from '../../../core/state-policy.js';
import { CONTENT_POLICY } from '../../../core/policy.js';
import { stateDefinitionShape } from '../shared/definition.js';

export const selectionValueSchema = z
  .array(z.string().min(1).max(CONTENT_POLICY.maxLabelLength))
  .max(STATE_POLICY.maxSelection)
  .refine(
    (values) => new Set(values).size === values.length,
    'Selection values must be unique.',
  )
  .readonly();
export const selectionStateSchema = z
  .strictObject({
    ...stateDefinitionShape,
    kind: z.literal('selection'),
    initial: selectionValueSchema,
  })
  .readonly();
