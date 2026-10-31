import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../../index.js';
import { TableExample } from '../../../../docs/examples/table.js';
import { GenerativeUI } from '../../../state/generative-ui/generative-ui.js';
import * as tableTest from '../../../../test-support/data-table.js';
it('hydrates native table controls and isolates SSR request models', async () => {
  const user = userEvent.setup();
  const tree = (
    <ReacdProvider adapter={activeTestAdapter}>
      <TableExample />
    </ReacdProvider>
  );
  const server = renderToString(tree);
  const container = document.createElement('div');
  container.innerHTML = server;
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(tree, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  expect(screen.getByRole('status')).toHaveTextContent('Page 2 of 3');
  expect(renderToString(tree)).toContain('Page 1 of 3');
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});
it('subscribes controller leases only on the client and releases them', async () => {
  const user = userEvent.setup();
  const { registry } = tableTest.tableFixture();
  const constrain = vi.fn(registry.constrain);
  const port = { ...registry, constrain };
  const documentModel = {
    schemaVersion: '0.2',
    state: tableTest.tableDefinitions(),
    root: {
      type: 'Table',
      mode: 'interactive',
      caption: 'Generated orders',
      columns: tableTest.TABLE_MODEL.columns,
      bindings: tableTest.TABLE_BINDINGS,
    },
  };
  const tree = (
    <GenerativeUI
      adapter={activeTestAdapter}
      document={documentModel}
      registry={port}
    />
  );
  const html = renderToString(tree);
  expect(constrain).not.toHaveBeenCalled();
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(tree, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  expect(constrain).toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  expect(screen.getByRole('status')).toHaveTextContent('Page 2 of 3');
  expect(errors).toEqual([]);
  view.unmount();
  expect(registry.update('orders.selection', ['missing']).success).toBe(true);
  container.remove();
});
