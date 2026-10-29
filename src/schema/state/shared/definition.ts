import { z } from 'zod';
import { STATE_ACCESS, STATE_POLICY } from '../../../core/state-policy.js';
import { textSchema } from '../../shared/values.js';

export const stateKeySchema = z
  .string()
  .min(1)
  .max(STATE_POLICY.maxKeyLength)
  .regex(/^[A-Za-z][A-Za-z0-9_.-]*$/);
export const rowIdSchema = z.string().min(1).max(STATE_POLICY.maxKeyLength);
export const scalarSchema = z.union([
  textSchema,
  z.number().finite(),
  z.boolean(),
  z.null(),
]);
export const stateDefinitionShape = {
  key: stateKeySchema,
  access: z.enum(STATE_ACCESS),
};
