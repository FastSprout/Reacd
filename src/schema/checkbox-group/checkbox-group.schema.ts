import { z } from 'zod';
import { CONTENT_POLICY } from '../../core/policy.js';
import { CHOICE_POLICY } from '../../core/choice-policy.js';
import {
  choiceGroupShape,
  choiceSelectionSchema,
  selectionChangeSchema,
  validChoiceSelection,
} from '../shared/choices.js';

export const checkboxGroupSchema = z
  .strictObject({
    ...choiceGroupShape,
    value: choiceSelectionSchema,
    onValueChange: selectionChangeSchema,
    max: z
      .number()
      .int()
      .min(CHOICE_POLICY.minMaxSelection)
      .max(CONTENT_POLICY.maxOptions)
      .optional(),
  })
  .refine(validChoiceSelection, 'Invalid checkbox group selection.');
