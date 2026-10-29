import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { EditorScopeContext } from '../../../renderer/editor/editor-context.js';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { ShadcnEditorToolbar } from './editor-toolbar.adapter.js';
import { editorPortFixture } from '../../../../test-support/editor-port.js';

const value = editorDocumentSchema.parse({
  version: 1,
  blocks: [{ type: 'paragraph', id: 'intro', content: [] }],
});

it('requires an editor scope rather than rendering orphan controls', () => {
  render(<ShadcnEditorToolbar />);
  expect(screen.getByRole('alert')).toHaveTextContent('inside an Editor');
  expect(screen.queryByRole('toolbar')).toBeNull();
});

it('runs closed commands with toolbar keyboard navigation', async () => {
  const execute = vi.fn();
  const user = userEvent.setup();
  render(
    <EditorScopeContext.Provider
      value={editorPortFixture(value, {
        available: () => true,
        active: (command) => command.command === 'bold',
        execute,
      })}
    >
      <ShadcnEditorToolbar
        label="Document formatting"
        items={[
          { command: 'bold', label: 'Emphasize text' },
          { command: 'link', href: '/reference', label: 'Apply reference' },
          { command: 'undo' },
        ]}
      />
    </EditorScopeContext.Provider>,
  );
  expect(screen.getByRole('toolbar', { name: 'Document formatting' })).toBeVisible();
  const bold = screen.getByRole('button', { name: 'Emphasize text' });
  expect(bold).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: 'Undo' })).not.toHaveAttribute(
    'aria-pressed',
  );
  await user.tab();
  expect(bold).toHaveFocus();
  await user.keyboard('{Enter}{ArrowRight}{Enter}');
  expect(execute).toHaveBeenNthCalledWith(1, { command: 'bold' });
  expect(execute).toHaveBeenNthCalledWith(2, { command: 'link', href: '/reference' });
  expect(execute).toHaveBeenCalledTimes(2);
});

it('protects unavailable commands and applies named defaults', async () => {
  const execute = vi.fn();
  const user = userEvent.setup();
  const scope = editorPortFixture(value, {
    disabled: true,
    active: () => false,
    available: () => true,
    execute,
  });
  const view = render(
    <EditorScopeContext.Provider value={scope}>
      <ShadcnEditorToolbar />
    </EditorScopeContext.Provider>,
  );
  expect(screen.getByRole('toolbar', { name: 'Formatting' })).toBeVisible();
  const bold = screen.getByRole('button', { name: 'Bold' });
  expect(bold).toBeDisabled();
  await user.click(bold);
  expect(execute).not.toHaveBeenCalled();
  view.rerender(
    <EditorScopeContext.Provider value={{ ...scope, disabled: false }}>
      <ShadcnEditorToolbar disabled />
    </EditorScopeContext.Provider>,
  );
  expect(screen.getByRole('button', { name: 'Bold' })).toBeDisabled();
  view.rerender(
    <EditorScopeContext.Provider
      value={{ ...scope, disabled: false, available: () => false }}
    >
      <ShadcnEditorToolbar />
    </EditorScopeContext.Provider>,
  );
  expect(screen.getByRole('button', { name: 'Bold' })).toBeDisabled();
  view.rerender(
    <EditorScopeContext.Provider value={{ ...scope, disabled: false }}>
      <ShadcnEditorToolbar items={[{ command: 'bold', disabled: true }]} />
    </EditorScopeContext.Provider>,
  );
  expect(screen.getByRole('button', { name: 'Bold' })).toBeDisabled();
});
