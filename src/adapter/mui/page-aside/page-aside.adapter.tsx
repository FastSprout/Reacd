import type { ComponentProps, ComponentType } from 'react';
import { SharedPageAside } from '../../shared/page-aside/page-aside.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiPageAsideProps = ComponentProps<typeof SharedPageAside>;
export const MuiPageAside: ComponentType<MuiPageAsideProps> = bindPrimitives(
  SharedPageAside,
  muiPrimitives,
  'MuiPageAside',
);
