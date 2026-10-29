import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import type { EditorDocument } from '../../core/editor-document.js';
import { EditorDragHandle } from './editor-drag-handle.js';
import { RenderContext } from '../shared/port.js';
import { EditorScopeContext } from '../../renderer/editor/editor-context.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import * as Registry from '../../adapter/shadcn/registry/editor-drag-handle.js';
import { editorPortFixture } from '../../../test-support/editor-port.js';
it('hydrates deterministic controls without invoking capabilities', () => {
  const documentModel: EditorDocument = {
    version: 1,
    blocks: [
      { type: 'paragraph', id: 'first', content: [] },
      { type: 'paragraph', id: 'second', content: [] },
    ],
  };
  const selectBlock = vi.fn();
  const beginBlockDrag = vi.fn(() => true);
  const editor = editorPortFixture(documentModel, {
    selectedBlockId: 'first',
    selectBlock,
    beginBlockDrag,
  });
  const tree = (
    <EditorScopeContext.Provider value={editor}>
      <RenderContext.Provider
        value={{
          render: (_name, props) =>
            Registry.editorDragHandleEntries.EditorDragHandle.render(props),
          report: (issues) => <Issues issues={issues} />,
        }}
      >
        <EditorDragHandle label="Document block" />
      </RenderContext.Provider>
    </EditorScopeContext.Provider>
  );
  const server = renderToString(tree);
  const container = document.createElement('div');
  container.innerHTML = server;
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(tree, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  expect(screen.getByRole('group', { name: 'Document block' })).toBeVisible();
  expect(errors).toEqual([]);
  expect(selectBlock).not.toHaveBeenCalled();
  expect(beginBlockDrag).not.toHaveBeenCalled();
  view.unmount();
  container.remove();
  expect(renderToString(tree)).toBe(server);
});
