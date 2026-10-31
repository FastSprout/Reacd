import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/editor-drag-handle/editor-drag-handle.adapter.js';
import { SharedEditorDragHandle } from
  '../../shared/editor-drag-handle/editor-drag-handle.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnEditorDragHandleProps = ComponentProps<typeof SharedEditorDragHandle>;
export const ShadcnEditorDragHandle: ComponentType<ShadcnEditorDragHandleProps> =
  bindPrimitives(SharedEditorDragHandle, shadcnPrimitives, 'ShadcnEditorDragHandle');
