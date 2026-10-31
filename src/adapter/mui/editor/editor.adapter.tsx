import type { ComponentProps, ComponentType } from 'react';
import { SharedEditor } from '../../shared/editor/editor.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiEditorProps = ComponentProps<typeof SharedEditor>;
export const MuiEditor: ComponentType<MuiEditorProps> = bindPrimitives(
  SharedEditor,
  muiPrimitives,
  'MuiEditor',
);
