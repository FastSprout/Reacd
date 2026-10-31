import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const definitions = [
  { key: 'preference', kind: 'text', access: 'readWrite', initial: 'system' },
  { key: 'system', kind: 'text', access: 'read', initial: 'light' },
];
const documentModel = {
  schemaVersion: '0.2',
  state: definitions,
  root: {
    type: 'VStack',
    children: [
      {
        type: 'ColorModeButton',
        label: 'Dark appearance',
        systemMode: 'light',
        value: { state: 'preference', mode: 'readWrite' },
      },
      {
        type: 'ColorModeSwitch',
        label: 'Dark palette',
        systemMode: { state: 'system', mode: 'read' },
        value: { state: 'preference', mode: 'readWrite' },
      },
      {
        type: 'ColorModeSelect',
        label: 'Reader',
        systemMode: 'light',
        value: { state: 'preference', mode: 'read' },
      },
      {
        type: 'ColorModeSelect',
        label: 'Protected',
        readOnly: true,
        systemMode: 'light',
        value: { state: 'preference', mode: 'readWrite' },
      },
      {
        type: 'ColorModeImage',
        alt: 'Bound illustration',
        mode: { state: 'system', mode: 'read' },
        light: '/light.svg',
        dark: '/dark.svg',
      },
      {
        type: 'ColorModeAvatar',
        name: 'Bound account',
        mode: { state: 'system', mode: 'read' },
        light: '/light.svg',
        dark: '/dark.svg',
      },
      {
        type: 'ColorModeImage',
        alt: 'Static illustration',
        mode: 'light',
        light: '/light.svg',
        dark: '/dark.svg',
      },
      {
        type: 'ColorModeAvatar',
        name: 'Static account',
        mode: 'dark',
        light: '/light.svg',
        dark: '/dark.svg',
      },
    ],
  },
};

it('hydrates isolated preference readers and resolves system mode', async () => {
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
  await user.click(screen.getByRole('button', { name: 'Dark appearance' }));
  expect(success(client.read('preference')).value).toBe('dark');
  expect(success(server.read('preference')).value).toBe('system');
  expect(screen.getByRole('combobox', { name: 'Reader' })).toHaveTextContent('Dark');
  expect(screen.getByRole('combobox', { name: 'Reader' })).toHaveAttribute(
    'aria-readonly',
    'true',
  );
  expect(screen.getByRole('combobox', { name: 'Protected' })).toHaveAttribute(
    'aria-readonly',
    'true',
  );
  await user.click(screen.getByRole('switch', { name: 'Dark palette' }));
  expect(success(client.read('preference')).value).toBe('light');
  act(() => {
    expect(client.update('preference', 'system').success).toBe(true);
    expect(client.update('system', 'dark').success).toBe(true);
    expect(client.update('system', 'blue').success).toBe(false);
    expect(client.update('preference', 'automatic').success).toBe(false);
  });
  expect(screen.getByRole('switch', { name: 'Dark palette' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  const image = screen.getByRole('img', { name: 'Bound illustration' });
  expect(image.querySelector('img')).toHaveAttribute('src', '/dark.svg');
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});

it('rejects invalid initial modes and writable asset references', () => {
  const view = render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={{
        ...documentModel,
        state: [definitions[0], { ...definitions[1], initial: 'system' }],
      }}
    />,
  );
  expect(screen.getByRole('alert')).toBeVisible();
  view.rerender(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={{
        schemaVersion: '0.2',
        state: definitions,
        root: {
          type: 'ColorModeImage',
          alt: 'Invalid writer',
          light: '/light.svg',
          dark: '/dark.svg',
          mode: { state: 'system', mode: 'readWrite' },
        },
      }}
    />,
  );
  expect(screen.getByRole('alert')).toBeVisible();
});
