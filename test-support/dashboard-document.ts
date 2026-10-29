function binding(state: string) {
  return { state, mode: 'readWrite' };
}
function text(content: string) {
  return { type: 'Text', content };
}
function action(label: string) {
  return { type: 'Button', label, action: 'inspect' };
}

export function dashboardDocument(selection = true) {
  return {
    schemaVersion: '0.2',
    state: [
      { key: 'desktop', kind: 'boolean', access: 'readWrite', initial: true },
      { key: 'mobile', kind: 'boolean', access: 'readWrite', initial: false },
      { key: 'searchOpen', kind: 'boolean', access: 'readWrite', initial: false },
      { key: 'query', kind: 'text', access: 'readWrite', initial: '' },
      { key: 'selected', kind: 'text', access: 'readWrite', initial: '' },
      { key: 'draft', kind: 'text', access: 'readWrite', initial: 'Retained draft' },
      {
        key: 'layout',
        kind: 'panelLayout',
        access: 'readWrite',
        initial: [
          { id: 'navigation', share: 25 },
          { id: 'inbox', share: 75 },
        ],
      },
    ],
    root: {
      type: 'DashboardGroup',
      label: 'Workspace',
      value: binding('layout'),
      open: binding('desktop'),
      mobileOpen: binding('mobile'),
      regions: [
        {
          id: 'navigation',
          label: 'Workspace navigation',
          kind: 'sidebar',
          content: [
            {
              type: 'DashboardSidebar',
              description: 'Workspace navigation description',
              header: [text('Header')],
              footer: [text('Footer')],
              actions: [action('Inspect navigation')],
              collapsedContent: [text('Short label')],
              children: [
                { type: 'Input', label: 'Navigation draft', value: binding('draft') },
              ],
            },
          ],
        },
        {
          id: 'inbox',
          label: 'Inbox',
          kind: 'panel',
          content: [
            {
              type: 'DashboardPanel',
              header: [
                {
                  type: 'DashboardNavbar',
                  leading: [{ type: 'DashboardSidebarCollapse' }],
                  trailing: [text('Trailing')],
                  start: [action('Inspect navbar')],
                  end: [text('End')],
                  children: [text('Navbar content')],
                },
              ],
              footer: [text('Panel footer')],
              children: [
                text('Panel body'),
                {
                  type: 'DashboardToolbar',
                  label: 'Inbox actions',
                  start: [
                    {
                      type: 'DashboardSidebarToggle',
                      label: 'Extra navigation toggle',
                    },
                  ],
                  end: [text('Toolbar end')],
                  children: [{ type: 'DashboardResizeHandle' }],
                },
              ],
            },
          ],
        },
      ],
      children: [
        { type: 'DashboardSearchButton', action: 'openSearch' },
        {
          type: 'DashboardSearch',
          label: 'Find workspace',
          open: binding('searchOpen'),
          query: binding('query'),
          ...(selection ? { selection: binding('selected') } : {}),
          groups: [
            {
              key: 'actions',
              label: 'Actions',
              items: [
                {
                  key: 'inspect-inbox',
                  label: 'Inspect inbox',
                  keywords: ['review'],
                  action: 'inspect',
                },
              ],
            },
          ],
        },
      ],
    },
  };
}
