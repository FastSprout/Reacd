import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { z } from 'zod';
import { ReacdProvider, Text } from '../../index.js';
import {
  GenerativeUI,
  createDocumentState,
  validateGenerativeDocument,
} from '../../generative.js';
import { BoundDashboardGroup } from './bound-dashboard-group.js';
import { BoundDashboardSearch } from './bound-dashboard-search.js';
import { dashboardGroupNodeSchema } from
  '../../schema/dashboard-group/generative.schema.js';
import { dashboardSearchNodeSchema } from
  '../../schema/dashboard-search/generative.schema.js';
import { dashboardBindings } from '../../schema/generative-v2/dashboard-bindings.js';
import { success } from '../../../test-support/data-table.js';
import { dashboardDocument } from '../../../test-support/dashboard-document.js';
import { installLayout } from '../../../test-support/layout-observer.js';

let restore: () => void;
beforeEach(() => {
  restore = installLayout();
});
afterEach(() => restore());

it('rejects aliases and invalid region refinements before generative rendering', () => {
  const binding = { state: 'state', mode: 'readWrite' };
  const group = {
    type: 'DashboardGroup',
    label: 'Workspace',
    value: { state: 'layout', mode: 'readWrite' },
    open: binding,
    mobileOpen: { state: 'mobile', mode: 'readWrite' },
    children: [],
    regions: [
      { id: 'nav', label: 'Navigation', kind: 'sidebar', content: [] },
      { id: 'main', label: 'Main', kind: 'panel', content: [] },
    ],
  };
  const schema = dashboardGroupNodeSchema(z.string());
  expect(schema.safeParse(group).success).toBe(true);
  expect(schema.safeParse({ ...group, mobileOpen: binding }).success).toBe(false);
  expect(
    schema.safeParse({
      ...group,
      regions: [
        {
          id: 'nav',
          label: 'Navigation',
          kind: 'sidebar',
          content: [],
          minShare: 95,
          maxShare: 90,
        },
        group.regions[1],
      ],
    }).success,
  ).toBe(false);
  const search = {
    type: 'DashboardSearch',
    label: 'Find',
    query: binding,
    open: { state: 'open', mode: 'readWrite' },
    groups: [
      {
        key: 'actions',
        label: 'Actions',
        items: [{ key: 'inspect', label: 'Inspect' }],
      },
    ],
  };
  expect(dashboardSearchNodeSchema.safeParse(search).success).toBe(false);
  expect(
    dashboardSearchNodeSchema.safeParse({ ...search, selection: binding }).success,
  ).toBe(false);
  expect(
    dashboardSearchNodeSchema.safeParse({
      ...search,
      selection: { state: 'selected', mode: 'readWrite' },
    }).success,
  ).toBe(true);
  expect(dashboardBindings({ type: 'Text', content: 'No binding' })).toEqual([]);
});

it('reports every missing bound state at its renderer boundary', () => {
  const document = success(validateGenerativeDocument(dashboardDocument()));
  if (document.root.type !== 'DashboardGroup')
    throw new Error('Missing group fixture.');
  const node = document.root;
  const registry = createDocumentState(document);
  const regions = node.regions.map((region) => ({
    ...region,
    content: <Text>Bound content</Text>,
  }));
  const view = render(
    <ReacdProvider>
      <BoundDashboardGroup
        node={{ ...node, value: { state: 'missing', mode: 'readWrite' } }}
        regions={regions}
        registry={registry}
      >
        {null}
      </BoundDashboardGroup>
    </ReacdProvider>,
  );
  expect(screen.getByRole('alert')).toBeVisible();
  for (const property of ['open', 'mobileOpen'] as const) {
    view.rerender(
      <ReacdProvider>
        <BoundDashboardGroup
          node={{ ...node, [property]: { state: 'missing', mode: 'readWrite' } }}
          regions={regions}
          registry={registry}
        >
          {null}
        </BoundDashboardGroup>
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toBeVisible();
  }
  const search = node.children.find((child) => child.type === 'DashboardSearch');
  if (!search) throw new Error('Missing search fixture.');
  for (const property of ['open', 'query', 'selection'] as const) {
    view.rerender(
      <ReacdProvider>
        <BoundDashboardSearch
          node={{ ...search, [property]: { state: 'missing', mode: 'readWrite' } }}
          registry={registry}
          actions={{}}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('alert')).toBeVisible();
  }
});

it('preflights missing state, access modes and descendant actions', () => {
  const missing = dashboardDocument();
  missing.state = [];
  expect(validateGenerativeDocument(missing).success).toBe(false);
  const readonly = dashboardDocument();
  readonly.state = readonly.state.map((definition) => ({
    ...definition,
    access: 'read',
  }));
  expect(validateGenerativeDocument(readonly).success).toBe(false);
  const document = success(validateGenerativeDocument(dashboardDocument()));
  const view = render(<GenerativeUI document={document} />);
  expect(screen.getByRole('alert')).toHaveTextContent('Action is not registered');
  expect(screen.queryByRole('group', { name: 'Workspace' })).toBeNull();
  view.rerender(
    <GenerativeUI
      document={document}
      actions={{
        inspect: () => undefined,
        openSearch: () => undefined,
      }}
    />,
  );
  expect(screen.queryByRole('alert')).toBeNull();
  expect(screen.getByRole('group', { name: 'Workspace' })).toBeVisible();
  view.unmount();
});
