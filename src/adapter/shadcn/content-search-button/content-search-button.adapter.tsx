import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/content-search-button/content-search-button.adapter.js';
import { SharedContentSearchButton } from
  '../../shared/content-search-button/content-search-button.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnContentSearchButtonProps = ComponentProps<
  typeof SharedContentSearchButton
>;
export const ShadcnContentSearchButton: ComponentType<ShadcnContentSearchButtonProps> =
  bindPrimitives(
    SharedContentSearchButton,
    shadcnPrimitives,
    'ShadcnContentSearchButton',
  );
