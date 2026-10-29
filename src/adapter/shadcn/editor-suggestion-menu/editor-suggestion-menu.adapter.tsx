import { useMemo } from 'react';
import type {
  EditorSuggestionMenuProps,
} from '../../../components/editor-suggestion-menu/index.js';
import type { EditorMenuItem } from '../../../renderer/editor/menu-context.js';
import { useEditorMenu } from '../editor-menu/use-editor-menu.js';
import { EditorMenuPanel } from '../editor-menu/menu-panel.js';

export function ShadcnEditorSuggestionMenu(properties: EditorSuggestionMenuProps) {
  const items = useMemo<readonly EditorMenuItem[]>(
    () =>
      properties.items.map((item) => ({
        ...item,
        kind: 'suggestion',
        value: { command: item.command },
      })),
    [properties.items],
  );
  const menu = useEditorMenu('suggestion', items, properties.disabled);
  return <EditorMenuPanel label={properties.label} {...menu} />;
}
