import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/kbd/kbd.adapter.js';
import { SharedKbd } from '../../shared/kbd/kbd.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnKbdProps = ComponentProps<typeof SharedKbd>;
export const ShadcnKbd: ComponentType<ShadcnKbdProps> = bindPrimitives(
  SharedKbd,
  shadcnPrimitives,
  'ShadcnKbd',
);
