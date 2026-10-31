import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/scroll-area/scroll-area.adapter.js';
import { SharedScrollArea } from '../../shared/scroll-area/scroll-area.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnScrollAreaProps = ComponentProps<typeof SharedScrollArea>;
export const ShadcnScrollArea: ComponentType<ShadcnScrollAreaProps> = bindPrimitives(
  SharedScrollArea,
  shadcnPrimitives,
  'ShadcnScrollArea',
);
