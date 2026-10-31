import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/main/main.adapter.js';
import { SharedMain } from '../../shared/main/main.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnMainProps = ComponentProps<typeof SharedMain>;
export const ShadcnMain: ComponentType<ShadcnMainProps> = bindPrimitives(
  SharedMain,
  shadcnPrimitives,
  'ShadcnMain',
);
