import type { ComponentProps, ComponentType } from 'react';
import { SharedCodeEditor } from '../../shared/code-editor/code-editor.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiCodeEditorProps = ComponentProps<typeof SharedCodeEditor>;
export const MuiCodeEditor: ComponentType<MuiCodeEditorProps> = bindPrimitives(
  SharedCodeEditor,
  muiPrimitives,
  'MuiCodeEditor',
);
