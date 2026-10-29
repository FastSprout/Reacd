import { z } from 'zod';
import { SLIDER_POLICY } from '../../core/slider-policy.js';
import type { BindingContract } from '../generative-v2/binding-contract.js';
import { stateBindingSchema } from '../state/binding.schema.js';
import { validSliderNumbers } from '../../core/slider-numeric.js';
import { sliderPropertiesSchema } from './properties.schema.js';
import { sliderNumberSchema, sliderRangeSchema } from './value.schema.js';

export const sliderNodeSchema = sliderPropertiesSchema
  .extend({
    type: z.literal('Slider'),
    mode: z.enum(['single', 'range']).optional(),
    value: stateBindingSchema,
  })
  .refine(validSliderNumbers, SLIDER_POLICY.invalidBoundsMessage);

export function sliderNodeBindings(
  node: z.infer<typeof sliderNodeSchema>,
): BindingContract[] {
  return [
    {
      reference: node.value,
      property: 'value',
      mode: node.value.mode,
      kinds: node.mode === 'range' ? ['numberRange'] : ['number'],
      schema:
        node.mode === 'range'
          ? sliderRangeSchema({ min: node.min, max: node.max })
          : sliderNumberSchema({ min: node.min, max: node.max }),
    },
  ];
}
