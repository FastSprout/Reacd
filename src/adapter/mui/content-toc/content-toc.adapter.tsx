import type { ComponentProps, ComponentType } from 'react';
import { SharedContentToc } from '../../shared/content-toc/content-toc.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiContentTocProps = ComponentProps<typeof SharedContentToc>;
export const MuiContentToc: ComponentType<MuiContentTocProps> = bindPrimitives(
  SharedContentToc,
  muiPrimitives,
  'MuiContentToc',
);
