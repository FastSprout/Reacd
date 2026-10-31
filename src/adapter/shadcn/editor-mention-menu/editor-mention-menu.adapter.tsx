import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/editor-mention-menu/editor-mention-menu.adapter.js';
import { SharedEditorMentionMenu } from
  '../../shared/editor-mention-menu/editor-mention-menu.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnEditorMentionMenuProps = ComponentProps<
  typeof SharedEditorMentionMenu
>;
export const ShadcnEditorMentionMenu: ComponentType<ShadcnEditorMentionMenuProps> =
  bindPrimitives(SharedEditorMentionMenu, shadcnPrimitives, 'ShadcnEditorMentionMenu');
