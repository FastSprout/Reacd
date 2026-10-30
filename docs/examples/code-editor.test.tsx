import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { CodeEditorExample } from './code-editor.js';

it('runs the CodeEditor public example', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <CodeEditorExample />
    </ReacdProvider>,
  );
  const source = screen.getByRole('textbox', { name: 'Editable source' });
  await user.clear(source);
  await user.type(source, 'Updated source');
  expect(source).toHaveValue('Updated source');
  expect(screen.getByText('Current source: Updated source')).toBeVisible();
});
