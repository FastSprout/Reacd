import { expect, it } from 'vitest';
import {
  siteOriginSchema,
  siteManifestSchema,
  sitePageSchema,
  sitePayloadSchema,
} from './model.schema.js';

const page = {
  route: '/',
  sourcePath: 'index.md',
  title: 'Start',
  titleAnchor: 'start',
  description: 'Start here',
  headings: [],
  sections: [
    {
      type: 'prose',
      key: 'prose:0',
      document: [{ type: 'paragraph', children: [{ type: 'text', text: 'Welcome' }] }],
    },
  ],
  source: '# Start',
};

it('validates structured browser payloads and both preview transports', () => {
  const navigation = [
    { key: 'start', label: 'Start', href: '/' },
    {
      key: 'components',
      label: 'Components',
      children: [{ key: 'button', label: 'Button', href: '/button/' }],
    },
  ];
  const site = {
    origin: 'https://reacd.dev/',
    title: 'reacd',
    description: 'Component-only interfaces',
    navigation,
    pages: [page],
  };
  expect(siteManifestSchema.parse(site)).toEqual(site);
  expect(
    sitePayloadSchema.parse({
      origin: site.origin,
      title: site.title,
      description: site.description,
      navigation,
      index: [],
      page,
    }),
  ).toBeDefined();
  expect(
    sitePageSchema.parse({
      ...page,
      sections: [
        { type: 'preview', key: 'preview:0', component: 'Button' },
        { type: 'preview', key: 'preview:100', example: 'Counter' },
      ],
    }).sections,
  ).toHaveLength(2);
});

it('rejects raw markup, extra payload keys and incomplete preview declarations', () => {
  expect(() => sitePageSchema.parse({ ...page, html: '<script/>' })).toThrow();
  expect(() =>
    sitePageSchema.parse({
      ...page,
      sections: [{ type: 'preview', key: 'preview:0' }],
    }),
  ).toThrow();
  expect(() =>
    sitePageSchema.parse({
      ...page,
      sections: [
        { type: 'prose', key: 'prose:0', document: [{ type: 'html', html: '<div/>' }] },
      ],
    }),
  ).toThrow();
});

it('rejects navigation that the closed framework component cannot render', () => {
  const base = {
    origin: 'https://reacd.dev/',
    title: 'reacd',
    description: 'Docs',
    page,
    index: [],
  };
  expect(
    sitePayloadSchema.safeParse({
      ...base,
      navigation: [{ key: 'page:button.md', label: 'Button', href: '/' }],
    }).success,
  ).toBe(false);
  expect(
    sitePayloadSchema.safeParse({
      ...base,
      navigation: [
        { key: 'duplicate', label: 'First', href: '/' },
        { key: 'duplicate', label: 'Second', href: '/' },
      ],
    }).success,
  ).toBe(false);
});

it.each([
  'http://reacd.dev/',
  'https://reacd.dev/nested/',
  'https://reacd.dev/?query=1',
  'https://reacd.dev/#hash',
  'https://user@reacd.dev/',
  'https://:password@reacd.dev/',
])('rejects noncanonical site origins %s', (origin) => {
  expect(siteOriginSchema.safeParse(origin).success).toBe(false);
});
