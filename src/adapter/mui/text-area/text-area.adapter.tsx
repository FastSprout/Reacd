import type { ComponentProps, ComponentType } from 'react';
import { SharedTextArea } from '../../shared/text-area/text-area.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiTextAreaProps = ComponentProps<typeof SharedTextArea>;
export const MuiTextArea: ComponentType<MuiTextAreaProps> = bindPrimitives(
  SharedTextArea,
  muiPrimitives,
  'MuiTextArea',
);
