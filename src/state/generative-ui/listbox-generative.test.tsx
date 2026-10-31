import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';

const documentSpec = {
  schemaVersion: '0.2',
  state: [{ key: 'choice', kind: 'text', initial: '42', access: 'readWrite' }],
  root: {
    type: 'Listbox',
    label: 'First',
    required: true,
    items: [
      { value: '42', label: 'Answer' },
      { value: 'b', label: 'Beta' },
    ],
    value: { state: 'choice', mode: 'readWrite' },
  },
} as const;

it('validates transport kinds, closed props and required empty values', () => {
  expect(validateGenerativeDocument(documentSpec).success).toBe(true);
  expect(
    validateGenerativeDocument({
      ...documentSpec,
      state: [{ ...documentSpec.state[0], initial: '' }],
    }).success,
  ).toBe(true);
  expect(
    validateGenerativeDocument({
      ...documentSpec,
      root: { ...documentSpec.root, mode: 'multiple' },
    }).success,
  ).toBe(false);
  expect(
    validateGenerativeDocument({
      ...documentSpec,
      root: { ...documentSpec.root, value: { state: 'missing', mode: 'read' } },
    }).success,
  ).toBe(false);
  expect(
    validateGenerativeDocument({
      ...documentSpec,
      root: { ...documentSpec.root, className: 'unsafe' },
    }).success,
  ).toBe(false);
});

it('hydrates isolated generative stores and routes selection requests', async () => {
  const user = userEvent.setup();
  const second = { ...documentSpec, root: { ...documentSpec.root, label: 'Second' } };
  const ui = (
    <>
      <GenerativeUI adapter={shadcnAdapter} document={documentSpec} />
      <GenerativeUI adapter={shadcnAdapter} document={second} />
    </>
  );
  const container = document.createElement('div');
  container.innerHTML = renderToString(ui);
  document.body.append(container);
  const errors: unknown[] = [];
  const view = render(ui, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  await user.click(
    within(screen.getByRole('listbox', { name: 'First' })).getByRole('option', {
      name: 'Beta',
    }),
  );
  expect(
    within(screen.getByRole('listbox', { name: 'First' })).getByRole('option', {
      name: 'Beta',
    }),
  ).toHaveAttribute('aria-selected', 'true');
  expect(
    within(screen.getByRole('listbox', { name: 'Second' })).getByRole('option', {
      name: 'Answer',
    }),
  ).toHaveAttribute('aria-selected', 'true');
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});
