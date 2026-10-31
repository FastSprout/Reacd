import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/editor-suggestion-menu/editor-suggestion-menu.adapter.js';
import { SharedEditorSuggestionMenu } from
  '../../shared/editor-suggestion-menu/editor-suggestion-menu.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnEditorSuggestionMenuProps = ComponentProps<
  typeof SharedEditorSuggestionMenu
>;
export const ShadcnEditorSuggestionMenu:
  ComponentType<ShadcnEditorSuggestionMenuProps> =
  bindPrimitives(
    SharedEditorSuggestionMenu,
    shadcnPrimitives,
    'ShadcnEditorSuggestionMenu',
  );
