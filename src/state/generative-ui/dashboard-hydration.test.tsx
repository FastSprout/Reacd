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
import { dashboardDocument } from '../../../test-support/dashboard-document.js';
import { installLayout } from '../../../test-support/layout-observer.js';

it('hydrates without errors and isolates closed mobile navigation', () => {
  const restore = installLayout(320);
  const documentValue = success(validateGenerativeDocument(dashboardDocument()));
  const server = createDocumentState(documentValue);
  const client = createDocumentState(documentValue);
  const actions = { inspect: () => undefined, openSearch: () => undefined };
  const container = document.createElement('div');
  container.innerHTML = renderToString(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={documentValue}
      registry={server}
      actions={actions}
    />,
  );
  document.body.appendChild(container);
  const panelIds = [...container.querySelectorAll('[data-panel]')]
    .map((panel) => panel.id);
  expect(panelIds).toHaveLength(2);
  expect(panelIds.every(Boolean)).toBe(true);
  const errors: unknown[] = [];
  const view = render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={documentValue}
      registry={client}
      actions={actions}
    />,
    { container, hydrate: true, onRecoverableError: (error) => errors.push(error) },
  );
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(screen.getByRole('main', { name: 'Inbox' })).toBeVisible();
  expect(container.querySelectorAll('[data-panel]')).toHaveLength(0);
  expect(screen.queryByRole('separator')).toBeNull();
  expect(errors).toEqual([]);
  fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
  expect(success(client.read('mobile')).value).toBe(true);
  expect(success(server.read('mobile')).value).toBe(false);
  view.unmount();
  container.remove();
  restore();
});
