import type { ComponentProps, ComponentType } from 'react';
import { SharedContentSearchButton } from
  '../../shared/content-search-button/content-search-button.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiContentSearchButtonProps = ComponentProps<
  typeof SharedContentSearchButton
>;
export const MuiContentSearchButton: ComponentType<MuiContentSearchButtonProps> =
  bindPrimitives(SharedContentSearchButton, muiPrimitives, 'MuiContentSearchButton');
