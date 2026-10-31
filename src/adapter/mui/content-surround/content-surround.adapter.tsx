import type { ComponentProps, ComponentType } from 'react';
import { SharedContentSurround } from
  '../../shared/content-surround/content-surround.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiContentSurroundProps = ComponentProps<typeof SharedContentSurround>;
export const MuiContentSurround: ComponentType<MuiContentSurroundProps> =
  bindPrimitives(SharedContentSurround, muiPrimitives, 'MuiContentSurround');
