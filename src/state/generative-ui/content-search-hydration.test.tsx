import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';

it('hydrates search state and isolates a new SSR request', async () => {
  const user = userEvent.setup();
  const declaration = defineGenerativeDeclaration({
    schemaVersion: '0.2',
    state: [
      { key: 'open', kind: 'boolean', initial: false, access: 'readWrite' },
      { key: 'query', kind: 'text', initial: '', access: 'readWrite' },
      { key: 'selection', kind: 'text', initial: '', access: 'readWrite' },
    ],
    root: {
      type: 'ContentSearch',
      title: 'Hydrated documentation',
      label: 'Hydrated query',
      triggerLabel: 'Open hydrated search',
      open: { state: 'open', mode: 'readWrite' },
      query: { state: 'query', mode: 'readWrite' },
      selection: { state: 'selection', mode: 'readWrite' },
      groups: [
        {
          key: 'docs',
          label: 'Docs',
          items: [{ key: 'guide', label: 'Guide' }],
        },
      ],
    },
  });
  const html = renderToString(
    <GenerativeUI adapter={shadcnAdapter} document={declaration} />,
  );
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(<GenerativeUI adapter={shadcnAdapter} document={declaration} />, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  await user.click(screen.getByRole('button', { name: 'Open hydrated search' }));
  await user.type(screen.getByRole('combobox'), 'guide');
  await user.click(screen.getByRole('option', { name: 'Guide' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  await user.click(screen.getByRole('button', { name: 'Open hydrated search' }));
  expect(screen.getByRole('combobox')).toHaveValue('guide');
  expect(
    renderToString(<GenerativeUI adapter={shadcnAdapter} document={declaration} />),
  ).toBe(html);
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});
