import { z } from 'zod';
import { CAROUSEL_POLICY } from '../../core/carousel-policy.js';
import type { CarouselOrientation } from '../../core/carousel-policy.js';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import type { DataState } from '../../core/policy.js';
import { labelSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { stateBindingSchema } from '../state/binding.schema.js';
import type { StateBindingReference } from '../state/binding.schema.js';
import { carouselSettingsSchema } from './carousel.schema.js';

export interface CarouselNode<Child> {
  type: 'Carousel';
  label: string;
  items: readonly { id: string; label: string; children: Child[] }[];
  value: StateBindingReference;
  orientation?: CarouselOrientation | undefined;
  loop?: boolean | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  state?: DataState | undefined;
  emptyMessage?: string | undefined;
  loadingMessage?: string | undefined;
  errorMessage?: string | undefined;
  retryLabel?: string | undefined;
  retryAction?: string | undefined;
}
export function carouselNodeSchema<Child extends z.ZodType>(child: Child) {
  return carouselSettingsSchema.extend({
    type: z.literal('Carousel'),
    items: z
      .array(
        z.strictObject({
          id: stateKeySchema,
          label: labelSchema,
          children: z.array(child).max(DOCUMENT_POLICY.maxChildren),
        }),
      )
      .max(CAROUSEL_POLICY.maxItems)
      .refine(
        (items) => new Set(items.map((item) => item.id)).size === items.length,
        'Carousel item identifiers must be unique.',
      )
      .readonly(),
    value: stateBindingSchema,
    retryAction: stateKeySchema.optional(),
  });
}
