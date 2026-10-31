import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import {
  GenerativeUI,
  createDocumentState,
  validateGenerativeDocument,
} from '../../generative.js';
import { success } from '../../../test-support/data-table.js';
import { installLayout } from '../../../test-support/layout-observer.js';

it('hydrates stable IDs, isolated stores and a closed mobile sidebar', () => {
  const restore = installLayout(320);
  const documentValue = success(
    validateGenerativeDocument({
      schemaVersion: '0.2',
      state: [
        { key: 'desktop', kind: 'boolean', access: 'readWrite', initial: true },
        { key: 'mobile', kind: 'boolean', access: 'readWrite', initial: false },
        {
          key: 'layout',
          kind: 'panelLayout',
          access: 'readWrite',
          initial: [
            { id: 'outline', share: 50 },
            { id: 'document', share: 50 },
          ],
        },
      ],
      root: {
        type: 'VStack',
        children: [
          {
            type: 'Sidebar',
            title: 'Navigation',
            open: { state: 'desktop', mode: 'readWrite' },
            mobileOpen: { state: 'mobile', mode: 'readWrite' },
            children: [{ type: 'Text', content: 'Navigation content' }],
          },
          {
            type: 'Splitter',
            label: 'Workspace',
            orientation: 'vertical',
            value: { state: 'layout', mode: 'readWrite' },
            panels: [
              { id: 'outline', label: 'Outline', content: [] },
              { id: 'document', label: 'Document', content: [] },
            ],
          },
        ],
      },
    }),
  );
  const server = createDocumentState(documentValue);
  const client = createDocumentState(documentValue);
  const container = document.createElement('div');
  container.innerHTML = renderToString(
    <GenerativeUI adapter={shadcnAdapter} document={documentValue} registry={server} />,
  );
  document.body.appendChild(container);
  const controls = screen.getByRole('separator').getAttribute('aria-controls');
  const errors: unknown[] = [];
  const view = render(
    <GenerativeUI adapter={shadcnAdapter} document={documentValue} registry={client} />,
    {
      container,
      hydrate: true,
      onRecoverableError: (error) => errors.push(error),
    },
  );
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(screen.getByRole('separator')).toHaveAttribute('aria-controls', controls);
  fireEvent.keyDown(screen.getByRole('separator'), { key: 'ArrowDown' });
  expect(success(client.read('layout')).value).toEqual([
    { id: 'outline', share: 51 },
    { id: 'document', share: 49 },
  ]);
  expect(success(server.read('layout')).value).toEqual([
    { id: 'outline', share: 50 },
    { id: 'document', share: 50 },
  ]);
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
  restore();
});
