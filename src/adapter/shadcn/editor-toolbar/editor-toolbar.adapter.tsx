import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/editor-toolbar/editor-toolbar.adapter.js';
import { SharedEditorToolbar } from
  '../../shared/editor-toolbar/editor-toolbar.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnEditorToolbarProps = ComponentProps<typeof SharedEditorToolbar>;
export const ShadcnEditorToolbar: ComponentType<ShadcnEditorToolbarProps> =
  bindPrimitives(SharedEditorToolbar, shadcnPrimitives, 'ShadcnEditorToolbar');
