import { useId, useMemo } from 'react';
import { EditorContent } from '@tiptap/react';
import type { EditorProps } from
  '@fastsprout/reacd/adapter-runtime/components/editor/index.js';
import { EDITOR_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/editor-policy.js';
import { EditorScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/editor/editor-context.js';
import { editorPlainText } from
  '@fastsprout/reacd/adapter-runtime/renderer/editor/plain-text.js';
import { useEditorSession } from './use-editor-session.js';
import { createEditorPort } from './use-editor-port.js';
import { EditorMenuScopeContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/editor/menu-context.js';
import { createEditorMenuPort } from '../editor-menu/menu-port.js';
import { EditorBoundary } from
  '@fastsprout/reacd/adapter-runtime/renderer/editor/editor-boundary.js';

function EditorSurface(properties: EditorProps) {
  const id = useId();
  const {
    editor,
    ready,
    issue,
    protectedView,
    drag,
    properties: effective,
  } = useEditorSession(properties, id);
  const port = createEditorPort(editor, effective, protectedView || !ready, drag);
  const menu = useMemo(
    () => createEditorMenuPort(editor, protectedView || !ready),
    [editor, protectedView, ready],
  );
  return (
    <EditorScopeContext value={port}>
      <EditorMenuScopeContext value={menu}>
        <div className="reacd-node reacd-editor">
          <div id={`${id}-label`} className="reacd-editor-label">
            {properties.label}
          </div>
          <div id={`${id}-description`}>{properties.description}</div>
          {properties.toolbar}
          {!ready && (
            <div
              role="region"
              aria-label={`${properties.label} preview`}
              className="reacd-editor-preview"
            >
              {editorPlainText(properties.value)}
              <span role="status">{EDITOR_DEFAULTS.loadingLabel}</span>
            </div>
          )}
          <div hidden={!ready} className="reacd-editor-content">
            <EditorContent editor={editor} />
          </div>
          {issue !== undefined && <p role="alert">{issue}</p>}
          {properties.children}
        </div>
      </EditorMenuScopeContext>
    </EditorScopeContext>
  );
}

export function SharedEditor(properties: EditorProps) {
  return (
    <EditorBoundary>
      <EditorSurface {...properties} />
    </EditorBoundary>
  );
}
