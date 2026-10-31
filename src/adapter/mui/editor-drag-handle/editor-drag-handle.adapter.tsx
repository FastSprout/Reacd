import type { ComponentProps, ComponentType } from 'react';
import { SharedEditorDragHandle } from
  '../../shared/editor-drag-handle/editor-drag-handle.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiEditorDragHandleProps = ComponentProps<typeof SharedEditorDragHandle>;
export const MuiEditorDragHandle: ComponentType<MuiEditorDragHandleProps> =
  bindPrimitives(SharedEditorDragHandle, muiPrimitives, 'MuiEditorDragHandle');
