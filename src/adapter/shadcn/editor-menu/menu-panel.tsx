import { EDITOR_MENU_POLICY } from '../../../core/editor-menu-policy.js';
import { Issues } from '../../../renderer/issues/issues.renderer.js';
import type { EditorMenuSnapshot } from './menu-store.js';

interface MenuPanelProps {
  readonly label: string;
  readonly listId: string;
  readonly orphan: boolean;
  readonly snapshot: EditorMenuSnapshot;
  readonly choose: (index: number) => void;
}
export function EditorMenuPanel({
  label,
  listId,
  orphan,
  snapshot,
  choose,
}: MenuPanelProps) {
  if (orphan)
    return (
      <Issues
        issues={[{ path: 'EditorMenu', message: EDITOR_MENU_POLICY.scopeError }]}
      />
    );
  if (snapshot === undefined) return null;
  if ('issues' in snapshot) return <Issues issues={snapshot.issues} />;
  const { items, selected, status, error } = snapshot.view;
  return (
    <div className="reacd-node reacd-editor-menu">
      <p id={`${listId}-label`}>{label}</p>
      <div role="listbox" id={listId} aria-labelledby={`${listId}-label`}
        aria-busy={status === 'loading'}>
        {items.map((item, index) => (
          <button
            type="button"
            role="option"
            key={
              item.kind === 'suggestion'
                ? item.value.command
                : item.kind === 'mention'
                  ? item.id
                  : item.name
            }
            id={`${listId}-${index}`}
            tabIndex={-1}
            aria-selected={index === selected}
            disabled={item.disabled === true}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {status === 'loading' && <p role="status">{EDITOR_MENU_POLICY.loading}</p>}
      {status === 'error' && <p role="alert">{error}</p>}
      {status === 'ready' && items.length === 0 &&
        <p role="status">{EDITOR_MENU_POLICY.empty}</p>}
    </div>
  );
}
