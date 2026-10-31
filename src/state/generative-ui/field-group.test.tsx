import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { GenerativeUI } from '../../generative.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';

const document = {
  schemaVersion: '0.2',
  state: [{ key: 'query', kind: 'text', access: 'readWrite', initial: '' }],
  root: {
    type: 'FieldGroup',
    label: 'Search controls',
    children: [
      {
        type: 'Input',
        label: 'Query',
        value: { state: 'query', mode: 'readWrite' },
      },
      { type: 'Button', label: 'Search', action: 'search' },
    ],
  },
};

it('validates nested references and dispatches child actions', async () => {
  const user = userEvent.setup();
  const action = vi.fn();
  expect(validateGenerativeDocument(document).success).toBe(true);
  render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={document}
      actions={{ search: action }}
    />,
  );
  await user.type(screen.getByRole('textbox', { name: 'Query' }), 'Reacd');
  await user.click(screen.getByRole('button', { name: 'Search' }));
  expect(action).toHaveBeenCalledOnce();
  const group = screen.getByRole('group', { name: 'Search controls' });
  expect(within(group).getByRole('textbox', { name: 'Query' })).toHaveValue('Reacd');
  const invalid = {
    ...document,
    root: {
      ...document.root,
      children: [{ type: 'Input', label: 'Invalid', value: { state: 'missing' } }],
    },
  };
  expect(validateGenerativeDocument(invalid).success).toBe(false);
});
