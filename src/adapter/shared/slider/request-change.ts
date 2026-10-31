import { z } from 'zod';
import type { SliderProps } from
  '@fastsprout/reacd/adapter-runtime/components/slider/index.js';
import {
  sliderNumberSchema,
  sliderRangeSchema,
} from '@fastsprout/reacd/adapter-runtime/schema/slider/value.schema.js';

const endpointsSchema = z.tuple([z.number().finite(), z.number().finite()]);

export function requestSliderChange(
  properties: SliderProps,
  candidate: unknown,
  disabled: boolean,
  active: boolean,
  cancel: () => void,
): void {
  if (disabled || properties.readOnly || !active) {
    cancel();
    return;
  }
  const bounds = { min: properties.min, max: properties.max };
  if (properties.mode === 'range') {
    const endpoints = endpointsSchema.safeParse(candidate);
    if (!endpoints.success) {
      cancel();
      return;
    }
    const value = sliderRangeSchema(bounds).safeParse({
      start: endpoints.data[0],
      end: endpoints.data[1],
    });
    if (!value.success) {
      cancel();
      return;
    }
    properties.onValueChange(value.data);
  } else {
    const value = sliderNumberSchema(bounds).safeParse(candidate);
    if (!value.success) {
      cancel();
      return;
    }
    properties.onValueChange(value.data);
  }
}
