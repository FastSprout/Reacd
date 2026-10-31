import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/v-stack/v-stack.adapter.js';
import { SharedVStack } from '../../shared/v-stack/v-stack.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnVStackProps = ComponentProps<typeof SharedVStack>;
export const ShadcnVStack: ComponentType<ShadcnVStackProps> = bindPrimitives(
  SharedVStack,
  shadcnPrimitives,
  'ShadcnVStack',
);
