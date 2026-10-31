import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/h-stack/h-stack.adapter.js';
import { SharedHStack } from '../../shared/h-stack/h-stack.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnHStackProps = ComponentProps<typeof SharedHStack>;
export const ShadcnHStack: ComponentType<ShadcnHStackProps> = bindPrimitives(
  SharedHStack,
  shadcnPrimitives,
  'ShadcnHStack',
);
