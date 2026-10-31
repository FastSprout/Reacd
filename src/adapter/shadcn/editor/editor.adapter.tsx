import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/editor/editor.adapter.js';
import { SharedEditor } from '../../shared/editor/editor.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnEditorProps = ComponentProps<typeof SharedEditor>;
export const ShadcnEditor: ComponentType<ShadcnEditorProps> = bindPrimitives(
  SharedEditor,
  shadcnPrimitives,
  'ShadcnEditor',
);
