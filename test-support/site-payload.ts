import type { SitePayload } from '../tooling/site/app/model.js';

export const sitePayload: SitePayload = {
  origin: 'https://reacd.dev',
  title: 'reacd',
  description: 'Compose interfaces with closed components.',
  navigation: [{ key: 'start', label: 'Get started', href: '/getting-started/' }],
  index: [{ route: '/getting-started/', title: 'Get started', description: 'Setup.' }],
  page: {
    route: '/getting-started/',
    sourcePath: 'getting-started.md',
    title: 'Get started',
    titleAnchor: 'get-started',
    description: 'Setup.',
    headings: [{ id: 'install', level: 2, title: 'Install' }],
    sections: [
      {
        type: 'prose',
        key: 'prose:0',
        document: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Use reacd components.' }],
          },
        ],
      },
    ],
    source: '# Get started\n\nUse reacd components.',
  },
};
