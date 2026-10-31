import { useMemo } from 'react';
import type {
  EditorMentionMenuProps,
  EditorMentionItem,
} from '@fastsprout/reacd/adapter-runtime/components/editor-mention-menu/index.js';
import type { EditorMenuItem } from
  '@fastsprout/reacd/adapter-runtime/renderer/editor/menu-context.js';
import { useEditorMenu } from '../editor-menu/use-editor-menu.js';
import { EditorMenuPanel } from '../editor-menu/menu-panel.js';

const EMPTY: readonly EditorMentionItem[] = Object.freeze([]);

export function SharedEditorMentionMenu(properties: EditorMentionMenuProps) {
  const catalog = properties.items ?? EMPTY;
  const items = useMemo<readonly EditorMenuItem[]>(
    () => catalog.map((item) => ({ ...item, kind: 'mention' })),
    [catalog],
  );
  const lookup = useMemo(
    () =>
      properties.onQueryChange === undefined
        ? undefined
        : {
            results: properties.results,
            onQueryChange: properties.onQueryChange,
          },
    [properties.results, properties.onQueryChange],
  );
  const menu = useEditorMenu('mention', items, properties.disabled, lookup);
  return <EditorMenuPanel label={properties.label} {...menu} />;
}
