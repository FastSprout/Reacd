import { z } from 'zod';
import { colorModeButtonSchema } from './color-mode-button.schema.js';
import { resolvedColorModeSchema } from '../color-mode/color-mode.schema.js';
import { readStateBindingSchema, stateBindingSchema } from '../state/binding.schema.js';

const {
  value: _value,
  resolvedMode: _resolved,
  onValueChange: _change,
  ...properties
} = colorModeButtonSchema.shape;
export const colorModeButtonNodeSchema = z.strictObject({
  ...properties,
  type: z.literal('ColorModeButton'),
  value: stateBindingSchema,
  systemMode: z.union([resolvedColorModeSchema, readStateBindingSchema]),
});
