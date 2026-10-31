import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/button/button.adapter.js';
import { SharedButton } from '../../shared/button/button.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnButtonProps = ComponentProps<typeof SharedButton>;
export const ShadcnButton: ComponentType<ShadcnButtonProps> = bindPrimitives(
  SharedButton,
  shadcnPrimitives,
  'ShadcnButton',
);
