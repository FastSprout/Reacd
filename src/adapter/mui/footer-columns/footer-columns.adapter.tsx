import type { ComponentProps, ComponentType } from 'react';
import { SharedFooterColumns } from
  '../../shared/footer-columns/footer-columns.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiFooterColumnsProps = ComponentProps<typeof SharedFooterColumns>;
export const MuiFooterColumns: ComponentType<MuiFooterColumnsProps> = bindPrimitives(
  SharedFooterColumns,
  muiPrimitives,
  'MuiFooterColumns',
);
