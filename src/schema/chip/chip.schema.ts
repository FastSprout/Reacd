import { z } from 'zod';
import { Children } from 'react';
import { CHIP_CORNERS, CHIP_SIZES, CHIP_POLICY } from '../../core/chip-policy.js';
import { BUTTON_INTENTS } from '../../core/policy.js';
import { childrenSchema } from '../shared/children.js';
import { labelSchema, textSchema } from '../shared/values.js';

export const chipTextSchema = z.union([
  textSchema,
  z.number().finite().min(-CHIP_POLICY.maxMagnitude).max(CHIP_POLICY.maxMagnitude),
]);
export const chipSchema = z
  .strictObject({
    label: labelSchema,
    text: chipTextSchema.optional(),
    intent: z.enum(BUTTON_INTENTS).optional(),
    size: z.enum(CHIP_SIZES).optional(),
    corner: z.enum(CHIP_CORNERS).optional(),
    inset: z.boolean().optional(),
    standalone: z.boolean().optional(),
    show: z.boolean().optional(),
    children: childrenSchema,
  })
  .refine(
    (props) => !props.standalone || Children.toArray(props.children).length === 0,
    'Standalone Chip cannot contain children.',
  );
