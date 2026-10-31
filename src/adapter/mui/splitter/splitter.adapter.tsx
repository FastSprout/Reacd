import type { ComponentProps, ComponentType } from 'react';
import { SharedSplitter } from '../../shared/splitter/splitter.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiSplitterProps = ComponentProps<typeof SharedSplitter>;
export const MuiSplitter: ComponentType<MuiSplitterProps> = bindPrimitives(
  SharedSplitter,
  muiPrimitives,
  'MuiSplitter',
);
