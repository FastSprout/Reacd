import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/toggle/toggle.adapter.js';
import { SharedToggle } from '../../shared/toggle/toggle.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnToggleProps = ComponentProps<typeof SharedToggle>;
export const ShadcnToggle: ComponentType<ShadcnToggleProps> = bindPrimitives(
  SharedToggle,
  shadcnPrimitives,
  'ShadcnToggle',
);
