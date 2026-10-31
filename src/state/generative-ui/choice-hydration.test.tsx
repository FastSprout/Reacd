import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { defineGenerativeDeclaration } from '../../schema/generative-v2/index.js';
import { GenerativeUI } from './generative-ui.js';
import { createDocumentState } from './create-document-state.js';
import { success } from '../../../test-support/data-table.js';

it('hydrates choice groups with stable IDs and isolated server state', async () => {
  const user = userEvent.setup();
  const document = defineGenerativeDeclaration({
    schemaVersion: '0.2',
    state: [
      { key: 'radio', kind: 'text', initial: 'a', access: 'readWrite' },
      { key: 'checks', kind: 'selection', initial: ['a'], access: 'readWrite' },
    ],
    root: {
      type: 'VStack',
      children: [
        {
          type: 'RadioGroup',
          label: 'Hydrated radio',
          value: { state: 'radio', mode: 'readWrite' },
          items: [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ],
        },
        {
          type: 'CheckboxGroup',
          label: 'Hydrated checks',
          value: { state: 'checks', mode: 'readWrite' },
          items: [
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ],
        },
      ],
    },
  });
  const server = createDocumentState(document);
  const container = globalThis.document.createElement('div');
  container.innerHTML = renderToString(
    <GenerativeUI adapter={shadcnAdapter} document={document} registry={server} />,
  );
  globalThis.document.body.appendChild(container);
  const before = screen.getByRole('radiogroup').getAttribute('aria-labelledby');
  const client = createDocumentState(document);
  const errors: unknown[] = [];
  const view = render(
    <GenerativeUI adapter={shadcnAdapter} document={document} registry={client} />,
    {
      container,
      hydrate: true,
      onRecoverableError: (error) => errors.push(error),
    },
  );
  expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-labelledby', before);
  await user.click(screen.getByRole('radio', { name: 'B' }));
  await user.click(screen.getByRole('checkbox', { name: 'B' }));
  expect(success(client.read('radio')).value).toBe('b');
  expect(success(client.read('checks')).value).toEqual(['a', 'b']);
  expect(success(server.read('radio')).value).toBe('a');
  expect(success(server.read('checks')).value).toEqual(['a']);
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});
