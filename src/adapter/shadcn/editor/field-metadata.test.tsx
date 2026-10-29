import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Editor, EditorToolbar, FormField, AuthForm, ReacdProvider } from 'reacd';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';

const value = editorDocumentSchema.parse({
  version: 1,
  blocks: [
    { type: 'paragraph', id: 'intro', content: [{ type: 'text', text: 'Start' }] },
  ],
});
let restore: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
});
afterEach(() => restore());

it('inherits disabled safety for native editing and toolbar', async () => {
  const change = vi.fn();
  render(
    <ReacdProvider>
      <FormField name="notes" label="Blocked group" disabled>
        <Editor
          label="Notes"
          value={value}
          disabled={false}
          onValueChange={change}
          toolbar={<EditorToolbar items={[{ command: 'bold' }]} />}
        />
      </FormField>
    </ReacdProvider>,
  );
  const box = await screen.findByRole('textbox', { name: 'Notes' });
  await waitFor(() => expect(box).toHaveAttribute('contenteditable', 'false'));
  expect(box).toHaveAttribute('aria-disabled', 'true');
  expect(box).toHaveAttribute('tabindex', '-1');
  expect(screen.getByRole('button', { name: 'Bold' })).toBeDisabled();
  await userEvent.click(box);
  await userEvent.keyboard('Unwanted');
  expect(change).not.toHaveBeenCalled();
  expect(box).toHaveTextContent('Start');
});

it('reads inherited error/guidance without duplicating the parent alert', async () => {
  render(
    <ReacdProvider>
      <FormField
        name="notes"
        label="Note group"
        description="Group guidance"
        error="Server rejected"
      >
        <Editor
          label="Notes"
          description="Local guidance"
          value={value}
          onValueChange={vi.fn()}
        />
      </FormField>
    </ReacdProvider>,
  );
  const box = await screen.findByRole('textbox', { name: 'Notes' });
  expect(box).toHaveAttribute('aria-invalid', 'true');
  expect(box).toHaveAccessibleDescription(/Group guidance.*Server rejected.*Local/);
  expect(screen.getAllByRole('alert')).toHaveLength(1);
});

it.each(['loading', 'disabled'] as const)(
  'adopts AuthForm %s protection for native contenteditable',
  async (protection) => {
    const change = vi.fn();
    render(
      <ReacdProvider>
        <AuthForm
          label="Credentials"
          submitLabel="Continue"
          onSubmit={vi.fn()}
          loading={protection === 'loading'}
          disabled={protection === 'disabled'}
        >
          <Editor label="Notes" value={value} disabled={false} onValueChange={change} />
        </AuthForm>
      </ReacdProvider>,
    );
    const box = await screen.findByRole('textbox', { name: 'Notes' });
    await waitFor(() => expect(box).toHaveAttribute('contenteditable', 'false'));
    expect(box).toHaveAttribute('aria-disabled', 'true');
    expect(change).not.toHaveBeenCalled();
  },
);
