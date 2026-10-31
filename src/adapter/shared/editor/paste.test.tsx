import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../../test-support/adapter-testing.js';
import { expect, it, vi } from 'vitest';
import { EDITOR_POLICY } from '../../../core/editor-policy.js';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { SharedEditor } from './editor.adapter.js';

it('pastes literal text and line breaks without interpreting HTML', async () => {
  const change = vi.fn();
  const value = editorDocumentSchema.parse({
    version: 1,
    blocks: [{ type: 'paragraph', id: 'intro', content: [] }],
  });
  render(<SharedEditor label="Notes" value={value} onValueChange={change} />);
  const box = await screen.findByRole('textbox', { name: 'Notes' });
  fireEvent.paste(box, {
    clipboardData: {
      getData: (type: string) =>
        type === 'text/plain'
          ? '<script>Literal</script>\nNext'
          : '<img src=x onerror=alert(1)>',
    },
  });
  await waitFor(() => expect(change).toHaveBeenCalledTimes(1));
  expect(change.mock.lastCall?.[0]).toEqual({
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: 'intro',
        content: [
          { type: 'text', text: '<script>Literal</script>' },
          { type: 'hardBreak' },
          { type: 'text', text: 'Next' },
        ],
      },
    ],
  });
  expect(box.querySelector('img,script')).toBeNull();
});

it('rejects oversized paste with a diagnostic and no callback', async () => {
  const change = vi.fn();
  const value = editorDocumentSchema.parse({
    version: 1,
    blocks: [{ type: 'paragraph', id: 'intro', content: [] }],
  });
  render(<SharedEditor label="Notes" value={value} onValueChange={change} />);
  fireEvent.paste(await screen.findByRole('textbox', { name: 'Notes' }), {
    clipboardData: { getData: () => 'x'.repeat(EDITOR_POLICY.maxCharacters + 1) },
  });
  expect(await screen.findByRole('alert')).toHaveTextContent('content limits');
  expect(change).not.toHaveBeenCalled();
});
