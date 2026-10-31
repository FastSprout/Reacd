import type { ComponentProps, ComponentType } from 'react';
import { SharedPageColumns } from '../../shared/page-columns/page-columns.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPageColumnsProps = ComponentProps<typeof SharedPageColumns>;
export const MuiPageColumns: ComponentType<MuiPageColumnsProps> = bindPrimitives(
  SharedPageColumns,
  muiPrimitives,
  'MuiPageColumns',
);
