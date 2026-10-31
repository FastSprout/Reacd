import type { ComponentProps, ComponentType } from 'react';
import { SharedEditorSuggestionMenu } from
  '../../shared/editor-suggestion-menu/editor-suggestion-menu.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiEditorSuggestionMenuProps = ComponentProps<
  typeof SharedEditorSuggestionMenu
>;
export const MuiEditorSuggestionMenu: ComponentType<MuiEditorSuggestionMenuProps> =
  bindPrimitives(SharedEditorSuggestionMenu, muiPrimitives, 'MuiEditorSuggestionMenu');
