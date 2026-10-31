import type { ComponentProps, ComponentType } from 'react';
import { SharedTextarea } from '../../shared/textarea/textarea.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiTextareaProps = ComponentProps<typeof SharedTextarea>;
export const MuiTextarea: ComponentType<MuiTextareaProps> = bindPrimitives(
  SharedTextarea,
  muiPrimitives,
  'MuiTextarea',
);
