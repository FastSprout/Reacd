import type { ComponentProps, ComponentType } from 'react';
import { SharedPageList } from '../../shared/page-list/page-list.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPageListProps = ComponentProps<typeof SharedPageList>;
export const MuiPageList: ComponentType<MuiPageListProps> = bindPrimitives(
  SharedPageList,
  muiPrimitives,
  'MuiPageList',
);
