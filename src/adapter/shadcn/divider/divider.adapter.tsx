import type { ComponentType } from 'react';
export * from '../../shared/divider/divider.adapter.js';
import { SharedDivider } from '../../shared/divider/divider.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnDividerProps = object;
export const ShadcnDivider: ComponentType<ShadcnDividerProps> = bindPrimitives(
  SharedDivider,
  shadcnPrimitives,
  'ShadcnDivider',
);
