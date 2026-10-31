import type { ComponentProps, ComponentType } from 'react';
import { SharedPageHeader } from '../../shared/page-header/page-header.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPageHeaderProps = ComponentProps<typeof SharedPageHeader>;
export const MuiPageHeader: ComponentType<MuiPageHeaderProps> = bindPrimitives(
  SharedPageHeader,
  muiPrimitives,
  'MuiPageHeader',
);
