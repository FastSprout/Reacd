import type { ComponentProps, ComponentType } from 'react';
import { SharedFooter } from '../../shared/footer/footer.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiFooterProps = ComponentProps<typeof SharedFooter>;
export const MuiFooter: ComponentType<MuiFooterProps> = bindPrimitives(
  SharedFooter,
  muiPrimitives,
  'MuiFooter',
);
