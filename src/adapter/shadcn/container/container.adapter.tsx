import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/container/container.adapter.js';
import { SharedContainer } from '../../shared/container/container.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnContainerProps = ComponentProps<typeof SharedContainer>;
export const ShadcnContainer: ComponentType<ShadcnContainerProps> = bindPrimitives(
  SharedContainer,
  shadcnPrimitives,
  'ShadcnContainer',
);
