import { z } from 'zod';
import type { ReactNode } from 'react';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { isSafeContent } from '../shared/children.js';
import { labelSchema, textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';

export const fieldErrorSchema = textSchema;
export const formFieldPropertiesSchema = z.strictObject({
  name: stateKeySchema,
  label: labelSchema.optional(),
  description: textSchema.optional(),
  hint: textSchema.optional(),
  help: textSchema.optional(),
  error: fieldErrorSchema.optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
});

export const formFieldSchema = formFieldPropertiesSchema.extend({
  children: z.custom<Exclude<ReactNode, undefined>>(
    (value) => value !== undefined && isSafeContent(value),
    FRAMEWORK_ERRORS.invalidChildren,
  ),
});
