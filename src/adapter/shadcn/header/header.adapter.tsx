import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/header/header.adapter.js';
import { SharedHeader } from '../../shared/header/header.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnHeaderProps = ComponentProps<typeof SharedHeader>;
export const ShadcnHeader: ComponentType<ShadcnHeaderProps> = bindPrimitives(
  SharedHeader,
  shadcnPrimitives,
  'ShadcnHeader',
);
