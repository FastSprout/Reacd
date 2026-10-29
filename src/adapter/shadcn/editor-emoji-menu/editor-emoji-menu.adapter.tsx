import { useMemo } from 'react';
import type {
  EditorEmojiMenuProps,
} from '../../../components/editor-emoji-menu/index.js';
import type { EditorMenuItem } from '../../../renderer/editor/menu-context.js';
import { useEditorMenu } from '../editor-menu/use-editor-menu.js';
import { EditorMenuPanel } from '../editor-menu/menu-panel.js';

export function ShadcnEditorEmojiMenu(properties: EditorEmojiMenuProps) {
  const items = useMemo<readonly EditorMenuItem[]>(
    () => properties.items.map((item) => ({ ...item, kind: 'emoji' })),
    [properties.items],
  );
  const menu = useEditorMenu('emoji', items, properties.disabled);
  return <EditorMenuPanel label={properties.label} {...menu} />;
}
