import { z } from 'zod';
import { validSliderBounds } from '../../core/slider-numeric.js';
import { sliderScalarSchema } from './numeric.schema.js';
import { SLIDER_POLICY } from '../../core/slider-policy.js';
import { labelSchema, textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const sliderPropertiesSchema = z.strictObject({
  label: labelSchema,
  min: sliderScalarSchema,
  max: sliderScalarSchema,
  step: sliderScalarSchema.positive().optional(),
  description: textSchema.optional(),
  name: stateKeySchema.optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  orientation: z.enum(['horizontal', 'vertical']).optional(),
});

export const sliderBoundsSchema = sliderPropertiesSchema
  .pick({ min: true, max: true })
  .refine(validSliderBounds, SLIDER_POLICY.invalidBoundsMessage);
