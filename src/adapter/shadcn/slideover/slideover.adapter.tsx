import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/slideover/slideover.adapter.js';
import { SharedSlideover } from '../../shared/slideover/slideover.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnSlideoverProps = ComponentProps<typeof SharedSlideover>;
export const ShadcnSlideover: ComponentType<ShadcnSlideoverProps> = bindPrimitives(
  SharedSlideover,
  shadcnPrimitives,
  'ShadcnSlideover',
);
