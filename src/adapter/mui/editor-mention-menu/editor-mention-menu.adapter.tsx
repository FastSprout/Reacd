import type { ComponentProps, ComponentType } from 'react';
import { SharedEditorMentionMenu } from
  '../../shared/editor-mention-menu/editor-mention-menu.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiEditorMentionMenuProps = ComponentProps<typeof SharedEditorMentionMenu>;
export const MuiEditorMentionMenu: ComponentType<MuiEditorMentionMenuProps> =
  bindPrimitives(SharedEditorMentionMenu, muiPrimitives, 'MuiEditorMentionMenu');
