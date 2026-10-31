import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const definitions = [
  { key: 'project', kind: 'text', initial: 'Local project', access: 'readWrite' },
  { key: 'busy', kind: 'boolean', initial: false, access: 'readWrite' },
  { key: 'blocked', kind: 'boolean', initial: false, access: 'readWrite' },
];
const documentModel = {
  schemaVersion: '0.2',
  state: definitions,
  root: {
    type: 'Form',
    label: 'Generated project',
    submitAction: 'save',
    submitting: { state: 'busy', mode: 'read' },
    disabled: { state: 'blocked', mode: 'read' },
    errors: [{ message: 'Previous example failed; retry is available.' }],
    children: [
      {
        type: 'Input',
        label: 'Project',
        name: 'project',
        required: true,
        value: { state: 'project', mode: 'readWrite' },
      },
      { type: 'SubmitButton', label: 'Save generated project' },
    ],
  },
};

it('hydrates whole-form actions and permits summary retries', async () => {
  const user = userEvent.setup();
  const server = success(createStateRegistry(definitions));
  const client = success(createStateRegistry(definitions));
  const save = vi.fn();
  const actions = { save };
  const container = document.createElement('div');
  container.innerHTML = renderToString(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={documentModel}
      registry={server}
      actions={actions}
    />,
  );
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={documentModel}
      registry={client}
      actions={actions}
    />,
    { container, hydrate: true, onRecoverableError: (error) => errors.push(error) },
  );
  try {
    const button = screen.getByRole('button', { name: 'Save generated project' });
    await user.click(button);
    await user.click(button);
    expect(save.mock.calls).toEqual([[{ state: client }], [{ state: client }]]);
    expect(screen.getByRole('alert')).toHaveTextContent('retry is available');
    const input = screen.getByRole('textbox', { name: 'Project' });
    await user.clear(input);
    await user.click(button);
    expect(save).toHaveBeenCalledTimes(2);
    expect(success(server.read('project')).value).toBe('Local project');
    act(() => {
      expect(client.update('busy', true).success).toBe(true);
    });
    expect(screen.getByRole('form')).toHaveAttribute('aria-busy', 'true');
    act(() => {
      expect(client.update('blocked', true).success).toBe(true);
    });
    expect(input).toBeDisabled();
    expect(errors).toEqual([]);
  } finally {
    view.unmount();
    container.remove();
  }
});

it('rejects missing actions and incompatible flag kinds', () => {
  const { rerender } = render(
    <GenerativeUI adapter={shadcnAdapter} document={documentModel} />,
  );
  expect(screen.getByRole('alert')).toBeVisible();
  expect(screen.queryByRole('form')).toBeNull();
  rerender(
    <GenerativeUI
      adapter={shadcnAdapter}
      actions={{ save() {} }}
      document={{
        ...documentModel,
        state: definitions.map((definition) =>
          definition.key === 'busy'
            ? {
                key: 'busy',
                kind: 'text',
                initial: 'false',
                access: 'readWrite',
              }
            : definition,
        ),
      }}
    />,
  );
  expect(screen.getByRole('alert')).toBeVisible();
  expect(screen.queryByRole('button')).toBeNull();
});
