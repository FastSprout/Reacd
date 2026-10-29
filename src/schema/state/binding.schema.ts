import { z } from 'zod';
import { STATE_ACCESS } from '../../core/state-policy.js';
import { stateKeySchema } from './shared/definition.js';

export const stateBindingSchema = z
  .strictObject({
    state: stateKeySchema,
    mode: z.enum(STATE_ACCESS),
  })
  .readonly();

export type StateBindingReference = z.infer<typeof stateBindingSchema>;

export const readStateBindingSchema = z
  .strictObject({
    state: stateKeySchema,
    mode: z.literal('read'),
  })
  .readonly();
export const writeStateBindingSchema = z
  .strictObject({
    state: stateKeySchema,
    mode: z.literal('readWrite'),
  })
  .readonly();
