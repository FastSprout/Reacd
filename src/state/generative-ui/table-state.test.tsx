import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../index.js';
import {
  tableNodeSchema,
  interactiveTableNodeSchema,
} from '../../schema/table/generative.schema.js';
import { tableDeclarationSchema } from '../../schema/table/table.schema.js';

import { ShadcnTable } from '../../adapter/shadcn/table/table.adapter.js';
import { renderEntry } from '../../renderer/contracts/render-entry.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { stateFailure } from '../registry/transaction.js';
import {
  TABLE_BINDINGS,
  TABLE_MODEL,
  tableFixture,
  success,
} from '../../../test-support/data-table.js';
import { GenerativeTable } from './generative-table.js';
const ADAPTER = {
  ...shadcnAdapter,
  components: {
    ...shadcnAdapter.components,
    Table: renderEntry('Table', tableDeclarationSchema, ShadcnTable),
  },
};
const NODE = interactiveTableNodeSchema.parse({
  type: 'Table',
  mode: 'interactive',
  caption: 'Bound orders',
  columns: TABLE_MODEL.columns,
  bindings: TABLE_BINDINGS,
});
it('shares validated table models and atomically resets pagination', async () => {
  const user = userEvent.setup();
  const { registry } = tableFixture({
    ...TABLE_MODEL,
    pagination: { pageIndex: 2, pageSize: 1 },
  });
  const view = render(
    <ReacdProvider adapter={ADAPTER}>
      <GenerativeTable node={NODE} registry={registry} actions={{}} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Sort Amount' }));
  expect(success(registry.read('orders.pagination')).value).toEqual({
    pageIndex: 0,
    pageSize: 1,
  });
  expect(screen.getByRole('cell', { name: 'Beta' })).toBeVisible();
  await user.click(screen.getByRole('checkbox', { name: 'Select row b' }));
  expect(success(registry.read('orders.selection')).value).toEqual(['b']);
  expect(registry.update('orders.selection', ['missing']).success).toBe(false);
  const rejected = {
    ...registry,
    transaction: () => stateFailure('table', 'Rejected'),
  };
  view.rerender(
    <ReacdProvider adapter={ADAPTER}>
      <GenerativeTable node={NODE} registry={rejected} actions={{}} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('checkbox', { name: 'Select row b' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Rejected');
  expect(success(registry.read('orders.selection')).value).toEqual(['b']);
  view.rerender(
    <ReacdProvider adapter={ADAPTER}>
      <GenerativeTable node={NODE} registry={registry} actions={{}} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('checkbox', { name: 'Select row b' }));
  expect(screen.queryByRole('alert')).toBeNull();
  expect(success(registry.read('orders.selection')).value).toEqual([]);
});
it('fails safely when state or the compound constraint port is unavailable', () => {
  const registry = success(createStateRegistry([]));
  const view = render(
    <ReacdProvider adapter={ADAPTER}>
      <GenerativeTable node={NODE} registry={registry} actions={{}} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  const fixture = tableFixture();
  const disconnected = {
    ...fixture.registry,
    constrain: () => stateFailure('table', 'Constraint rejected'),
  };
  view.rerender(
    <ReacdProvider adapter={ADAPTER}>
      <GenerativeTable node={NODE} registry={disconnected} actions={{}} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Constraint rejected');
  let unavailable = false;
  const port = {
    ...fixture.registry,
    read: (key: string) =>
      unavailable
        ? stateFailure(key, 'Reader unavailable')
        : fixture.registry.read(key),
  };
  view.rerender(
    <ReacdProvider adapter={ADAPTER}>
      <GenerativeTable node={NODE} registry={port} actions={{}} />
    </ReacdProvider>,
  );
  unavailable = true;
  view.rerender(
    <ReacdProvider adapter={ADAPTER}>
      <GenerativeTable
        node={{ ...NODE, disabled: true }}
        registry={port}
        actions={{}}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Reader unavailable');
});
it('resolves static retry and supports reader-only models', async () => {
  const user = userEvent.setup();
  const { registry } = tableFixture();
  const retry = vi.fn();
  const staticNode = tableNodeSchema.parse({
    type: 'Table',
    caption: 'Static',
    columns: ['Value'],
    rows: [['A']],
    state: 'error',
    retryAction: 'retry',
  });
  const view = render(
    <ReacdProvider adapter={ADAPTER}>
      <GenerativeTable node={staticNode} registry={registry} actions={{ retry }} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Retry table' }));
  expect(retry).toHaveBeenCalledExactlyOnceWith({ state: registry });
  view.rerender(
    <ReacdProvider adapter={ADAPTER}>
      <GenerativeTable node={staticNode} registry={registry} actions={{}} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Retry table' }));
  expect(retry).toHaveBeenCalledOnce();
  const reader = tableNodeSchema.parse({
    ...NODE,
    bindings: Object.fromEntries(
      Object.entries(TABLE_BINDINGS).map(([key, value]) => [
        key,
        { ...value, mode: 'read' },
      ]),
    ),
  });
  view.rerender(
    <ReacdProvider adapter={ADAPTER}>
      <GenerativeTable node={reader} registry={registry} actions={{}} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('checkbox', { name: 'Select row a' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Sort Amount' })).toBeDisabled();
});
