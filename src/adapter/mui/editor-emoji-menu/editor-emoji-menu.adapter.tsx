import type { ComponentProps, ComponentType } from 'react';
import { SharedEditorEmojiMenu } from
  '../../shared/editor-emoji-menu/editor-emoji-menu.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiEditorEmojiMenuProps = ComponentProps<typeof SharedEditorEmojiMenu>;
export const MuiEditorEmojiMenu: ComponentType<MuiEditorEmojiMenuProps> =
  bindPrimitives(SharedEditorEmojiMenu, muiPrimitives, 'MuiEditorEmojiMenu');
