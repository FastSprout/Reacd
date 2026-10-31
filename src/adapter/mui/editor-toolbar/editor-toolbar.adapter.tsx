import type { ComponentProps, ComponentType } from 'react';
import { SharedEditorToolbar } from
  '../../shared/editor-toolbar/editor-toolbar.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiEditorToolbarProps = ComponentProps<typeof SharedEditorToolbar>;
export const MuiEditorToolbar: ComponentType<MuiEditorToolbarProps> = bindPrimitives(
  SharedEditorToolbar,
  muiPrimitives,
  'MuiEditorToolbar',
);
