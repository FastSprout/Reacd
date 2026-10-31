import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/code-editor/code-editor.adapter.js';
import { SharedCodeEditor } from '../../shared/code-editor/code-editor.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnCodeEditorProps = ComponentProps<typeof SharedCodeEditor>;
export const ShadcnCodeEditor: ComponentType<ShadcnCodeEditorProps> = bindPrimitives(
  SharedCodeEditor,
  shadcnPrimitives,
  'ShadcnCodeEditor',
);
