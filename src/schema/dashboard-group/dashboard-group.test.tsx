import { describe, expect, it } from 'vitest';
import {
  dashboardGroupSchema,
  dashboardRegionsSchema,
} from './dashboard-group.schema.js';
import { dashboardSidebarSchema } from
  '../dashboard-sidebar/dashboard-sidebar.schema.js';
import { dashboardPanelSchema } from '../dashboard-panel/dashboard-panel.schema.js';
import { dashboardNavbarSchema } from '../dashboard-navbar/dashboard-navbar.schema.js';
import { dashboardToolbarSchema } from
  '../dashboard-toolbar/dashboard-toolbar.schema.js';
import { dashboardSidebarCollapseSchema } from
  '../dashboard-sidebar-collapse/dashboard-sidebar-collapse.schema.js';
import { dashboardSidebarToggleSchema } from
  '../dashboard-sidebar-toggle/dashboard-sidebar-toggle.schema.js';
import { dashboardResizeHandleSchema } from
  '../dashboard-resize-handle/dashboard-resize-handle.schema.js';
import { dashboardSearchButtonSchema } from
  '../dashboard-search-button/dashboard-search-button.schema.js';
import { dashboardSearchSchema } from '../dashboard-search/dashboard-search.schema.js';

const regions = [
  { id: 'navigation', kind: 'sidebar', label: 'Navigation' },
  { id: 'inbox', kind: 'panel', label: 'Inbox' },
];
const declaration = {
  label: 'Workspace',
  regions,
  open: true,
  onOpenChange: () => undefined,
  mobileOpen: false,
  onMobileOpenChange: () => undefined,
  value: [
    { id: 'navigation', share: 25 },
    { id: 'inbox', share: 75 },
  ],
  onValueChange: () => undefined,
};

describe('closed dashboard declarations', () => {
  it('validates region identities, scope, constraints and independent state', () => {
    expect(dashboardGroupSchema.safeParse(declaration).success).toBe(true);
    for (const invalid of [
      [],
      [regions[0]],
      [regions[0], regions[0]],
      [regions[1], { id: 'second', kind: 'panel', label: 'Second' }],
      [{ ...regions[0], minShare: 95, maxShare: 90 }, regions[1]],
      [{ ...regions[0], content: <div /> }, regions[1]],
      [{ ...regions[0], minShare: Number.POSITIVE_INFINITY }, regions[1]],
    ])
      expect(
        dashboardGroupSchema.safeParse({ ...declaration, regions: invalid }).success,
      ).toBe(false);
    expect(
      dashboardGroupSchema.safeParse({
        ...declaration,
        value: [
          { id: 'inbox', share: 25 },
          { id: 'navigation', share: 75 },
        ],
      }).success,
    ).toBe(false);
    expect(
      dashboardGroupSchema.safeParse({ ...declaration, mobileOpen: undefined }).success,
    ).toBe(false);
    expect(
      dashboardRegionsSchema.safeParse([
        ...regions,
        { id: 'notes', label: 'Notes', kind: 'panel' },
      ]).success,
    ).toBe(true);
  });

  it('rejects arbitrary rendering and native events for every dashboard module', () => {
    const cases = [
      [dashboardGroupSchema, declaration],
      [dashboardSidebarSchema, {}],
      [dashboardPanelSchema, {}],
      [dashboardNavbarSchema, {}],
      [dashboardToolbarSchema, { label: 'Actions' }],
      [dashboardSidebarCollapseSchema, {}],
      [dashboardSidebarToggleSchema, {}],
      [dashboardResizeHandleSchema, {}],
      [dashboardSearchButtonSchema, { onPress: () => undefined }],
      [
        dashboardSearchSchema,
        {
          label: 'Find',
          query: '',
          groups: [],
          open: false,
          onQueryChange: () => undefined,
          onOpenChange: () => undefined,
        },
      ],
    ] as const;
    for (const [schema, properties] of cases) {
      expect(schema.safeParse(properties).success).toBe(true);
      for (const escape of [
        { className: 'custom' },
        { style: { width: 10 } },
        { as: 'div' },
        { onClick: () => undefined },
      ]) {
        expect(schema.safeParse({ ...properties, ...escape }).success).toBe(false);
      }
    }
  });

  it('preserves CommandPalette action and selection validation in modal search', () => {
    const base = {
      label: 'Find',
      query: '',
      open: false,
      onQueryChange: () => undefined,
      onOpenChange: () => undefined,
      groups: [
        {
          key: 'actions',
          label: 'Actions',
          items: [{ key: 'inspect', label: 'Inspect' }],
        },
      ],
    };
    expect(dashboardSearchSchema.safeParse(base).success).toBe(false);
    expect(
      dashboardSearchSchema.safeParse({ ...base, onSelect: () => true }).success,
    ).toBe(true);
    expect(
      dashboardSearchSchema.safeParse({
        ...base,
        groups: [
          {
            key: 'actions',
            label: 'Actions',
            items: [{ key: 'inspect', label: 'Inspect', onPress: () => undefined }],
          },
        ],
      }).success,
    ).toBe(true);
  });
});
