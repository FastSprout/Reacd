import type { ComponentProps, ComponentType } from 'react';
import { SharedHeader } from '../../shared/header/header.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiHeaderProps = ComponentProps<typeof SharedHeader>;
export const MuiHeader: ComponentType<MuiHeaderProps> = bindPrimitives(
  SharedHeader,
  muiPrimitives,
  'MuiHeader',
);
