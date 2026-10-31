import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/editor-emoji-menu/editor-emoji-menu.adapter.js';
import { SharedEditorEmojiMenu } from
  '../../shared/editor-emoji-menu/editor-emoji-menu.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnEditorEmojiMenuProps = ComponentProps<typeof SharedEditorEmojiMenu>;
export const ShadcnEditorEmojiMenu: ComponentType<ShadcnEditorEmojiMenuProps> =
  bindPrimitives(SharedEditorEmojiMenu, shadcnPrimitives, 'ShadcnEditorEmojiMenu');
