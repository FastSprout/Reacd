import { z } from 'zod';
import { DOCUMENT_POLICY, CONTENT_POLICY } from '../../core/policy.js';
import { tabsSchema, tabItemSchema } from './tabs.schema.js';
import { stateBindingSchema } from '../state/binding.schema.js';
import type { StateBindingReference } from '../state/binding.schema.js';

export interface TabsNode<Content> {
  type: 'Tabs';
  label: string;
  value: StateBindingReference;
  orientation?: 'horizontal' | 'vertical' | undefined;
  activationMode?: 'automatic' | 'manual' | undefined;
  children: Content[];
  items: {
    value: string;
    label: string;
    disabled?: boolean | undefined;
    content?: Content[] | undefined;
  }[];
}

export function tabsNodeSchema<Content extends z.ZodType>(content: Content) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  const item = z.strictObject({ ...tabItemSchema.shape, content: slot.optional() });
  const { onValueChange: _change, ...shape } = tabsSchema.shape;
  return z.strictObject({
    ...shape,
    type: z.literal('Tabs'),
    value: stateBindingSchema,
    children: slot,
    items: z
      .array(item)
      .min(1)
      .max(CONTENT_POLICY.maxOptions)
      .refine(
        (items) => new Set(items.map((entry) => entry.value)).size === items.length,
        'Tab values must be unique.',
      ),
  });
}
