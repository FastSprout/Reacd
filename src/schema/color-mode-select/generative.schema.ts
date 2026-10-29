import { z } from 'zod';
import { colorModeSelectSchema } from './color-mode-select.schema.js';
import { resolvedColorModeSchema } from '../color-mode/color-mode.schema.js';
import { readStateBindingSchema, stateBindingSchema } from '../state/binding.schema.js';

const {
  value: _value,
  resolvedMode: _resolved,
  onValueChange: _change,
  ...properties
} = colorModeSelectSchema.shape;
export const colorModeSelectNodeSchema = z.strictObject({
  ...properties,
  type: z.literal('ColorModeSelect'),
  value: stateBindingSchema,
  systemMode: z.union([resolvedColorModeSchema, readStateBindingSchema]),
});
