import type { ComponentProps, ComponentType } from 'react';
import { SharedPageBody } from '../../shared/page-body/page-body.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPageBodyProps = ComponentProps<typeof SharedPageBody>;
export const MuiPageBody: ComponentType<MuiPageBodyProps> = bindPrimitives(
  SharedPageBody,
  muiPrimitives,
  'MuiPageBody',
);
