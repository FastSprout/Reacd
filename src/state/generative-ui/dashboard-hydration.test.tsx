import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import {
  GenerativeUI,
  createDocumentState,
  validateGenerativeDocument,
} from '../../generative.js';
import { success } from '../../../test-support/data-table.js';
import { dashboardDocument } from '../../../test-support/dashboard-document.js';
import { installLayout } from '../../../test-support/layout-observer.js';

it('hydrates stable IDs, isolated state and closed mobile navigation', () => {
  const restore = installLayout(320);
  const documentValue = success(validateGenerativeDocument(dashboardDocument()));
  const server = createDocumentState(documentValue);
  const client = createDocumentState(documentValue);
  const actions = { inspect: () => undefined, openSearch: () => undefined };
  const container = document.createElement('div');
  container.innerHTML = renderToString(
    <GenerativeUI document={documentValue} registry={server} actions={actions} />,
  );
  document.body.appendChild(container);
  const controls = screen.getByRole('separator').getAttribute('aria-controls');
  const errors: unknown[] = [];
  const view = render(
    <GenerativeUI document={documentValue} registry={client} actions={actions} />,
    { container, hydrate: true, onRecoverableError: (error) => errors.push(error) },
  );
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(screen.getByRole('main', { name: 'Inbox' })).toBeVisible();
  if (!controls) throw new Error('Missing region ID relationship.');
  for (const id of controls.split(' '))
    expect(document.getElementById(id)).not.toBeNull();
  expect(errors).toEqual([]);
  fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
  expect(success(client.read('mobile')).value).toBe(true);
  expect(success(server.read('mobile')).value).toBe(false);
  view.unmount();
  container.remove();
  restore();
});
