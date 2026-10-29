import type { ReactNode } from 'react';
import type { z } from 'zod';
import type { StateKind } from '../../core/state-policy.js';
import type { StateBindingReference } from '../../schema/state/binding.schema.js';
import type { StateRegistry } from '../registry/registry.types.js';

export interface ReadValueProps<Value> {
  registry: StateRegistry;
  reference: StateBindingReference | undefined;
  literal: Value;
  kinds: readonly StateKind[];
  schema: z.ZodType<Value>;
  children: (value: Value) => ReactNode;
}
