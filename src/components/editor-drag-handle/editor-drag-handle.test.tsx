import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import type { EditorDocument } from '../../core/editor-document.js';
import { EditorDragHandle } from './editor-drag-handle.js';
import { RenderContext } from '../shared/port.js';
import { EditorScopeContext } from '../../renderer/editor/editor-context.js';
import { Issues } from '../../renderer/issues/issues.renderer.js';
import { editorDragHandleSchema } from
  '../../schema/editor-drag-handle/editor-drag-handle.schema.js';
import { renderEntry } from '../../renderer/contracts/render-entry.js';
import { editorPortFixture } from '../../../test-support/editor-port.js';
const entry = renderEntry(
  'EditorDragHandle',
  editorDragHandleSchema,
  ({ label }) => label,
);
it('hydrates declaration output without invoking editor capabilities', () => {
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
          render: (_name, props) => entry.render(props),
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
  expect(screen.getByText('Document block')).toBeVisible();
  expect(errors).toEqual([]);
  expect(selectBlock).not.toHaveBeenCalled();
  expect(beginBlockDrag).not.toHaveBeenCalled();
  view.unmount();
  container.remove();
  expect(renderToString(tree)).toBe(server);
});
