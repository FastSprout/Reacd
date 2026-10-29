import { z } from 'zod';
import { colorModeSwitchSchema } from './color-mode-switch.schema.js';
import { resolvedColorModeSchema } from '../color-mode/color-mode.schema.js';
import { readStateBindingSchema, stateBindingSchema } from '../state/binding.schema.js';

const {
  value: _value,
  resolvedMode: _resolved,
  onValueChange: _change,
  ...properties
} = colorModeSwitchSchema.shape;
export const colorModeSwitchNodeSchema = z.strictObject({
  ...properties,
  type: z.literal('ColorModeSwitch'),
  value: stateBindingSchema,
  systemMode: z.union([resolvedColorModeSchema, readStateBindingSchema]),
});
