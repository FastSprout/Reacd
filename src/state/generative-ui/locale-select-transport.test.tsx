import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../provider/provider.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { BoundLocaleSelect } from './bound-locale-select.js';
import { GenerativeUI } from './generative-ui.js';

const locales = [
  { code: 'en-US', label: 'English' },
  { code: 'pl-PL', label: 'Polish' },
];
const definitions = [
  { key: 'locale', kind: 'text', access: 'readWrite', initial: 'en-US' },
];
const node = {
  type: 'LocaleSelect',
  label: 'Language',
  locales,
  value: { state: 'locale', mode: 'readWrite' },
} as const;
const documentModel = {
  schemaVersion: '0.2',
  state: definitions,
  root: {
    type: 'VStack',
    children: ['Language', 'Reader', 'Protected'].map((label) => ({
      ...node,
      label,
      locales: locales.map((locale) => ({ ...locale })),
      readOnly: label === 'Protected',
      value: { state: 'locale', mode: label === 'Reader' ? 'read' : 'readWrite' },
    })),
  },
};

it('hydrates selected labels and isolates constrained application stores', async () => {
  const user = userEvent.setup();
  const server = success(createStateRegistry(definitions));
  const client = success(createStateRegistry(definitions));
  const container = document.createElement('div');
  container.innerHTML = renderToString(
    <GenerativeUI adapter={shadcnAdapter} document={documentModel} registry={server} />,
  );
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(
    <GenerativeUI adapter={shadcnAdapter} document={documentModel} registry={client} />,
    {
      container,
      hydrate: true,
      onRecoverableError: (error) => errors.push(error),
    },
  );
  const trigger = screen.getByRole('combobox', { name: 'Language' });
  expect(trigger).toHaveTextContent('English');
  await user.click(trigger);
  await user.click(screen.getByRole('option', { name: 'Polish' }));
  expect(success(client.read('locale')).value).toBe('pl-PL');
  expect(success(server.read('locale')).value).toBe('en-US');
  expect(screen.getByRole('combobox', { name: 'Reader' })).toHaveTextContent('Polish');
  expect(screen.getByRole('combobox', { name: 'Reader' })).toHaveAttribute(
    'aria-readonly',
    'true',
  );
  expect(screen.getByRole('combobox', { name: 'Protected' })).toHaveAttribute(
    'aria-readonly',
    'true',
  );
  act(() => {
    expect(client.update('locale', 'fr-FR').success).toBe(false);
  });
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});

it('reports missing, incompatible and out-of-list locale bindings', () => {
  const registry = success(createStateRegistry([]));
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundLocaleSelect node={node} registry={registry} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('alert')).toBeVisible();
  for (const state of [
    [{ key: 'locale', kind: 'boolean', access: 'readWrite', initial: true }],
    [{ ...definitions[0], initial: 'fr-FR' }],
  ]) {
    view.rerender(
      <GenerativeUI adapter={shadcnAdapter} document={{ ...documentModel, state }} />,
    );
    expect(screen.getByRole('alert')).toBeVisible();
    expect(screen.queryByRole('combobox')).toBeNull();
  }
});
