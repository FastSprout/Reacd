import type { z } from 'zod';
import type { StateAccess, StateKind } from '../../core/state-policy.js';
import type { StateBindingReference } from '../state/binding.schema.js';

export interface BindingContract {
  reference: StateBindingReference;
  property: string;
  kinds: readonly StateKind[];
  mode: StateAccess;
  schema: z.ZodType;
}
