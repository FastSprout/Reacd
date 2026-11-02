import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { sitePayload } from '../../../test-support/site-payload.js';
import { SITE_POLICY } from '../policy.js';
import { loadSite } from '../content/index.js';
import { renderSiteDocument } from '../runtime/server.js';
import { buildSite } from './site.js';
import { sitePayloadSchema } from '../content/model.schema.js';
import type { ProseDocument } from '../../../src/core/prose.js';
const { rename } = vi.hoisted(() => ({
  rename: vi.fn<(typeof import('node:fs/promises'))['rename']>(),
}));
vi.mock('node:fs/promises', async (original) => ({
  ...(await original<typeof import('node:fs/promises')>()),
  rename,
}));
vi.mock('../content/index.js', () => ({ loadSite: vi.fn() }));
vi.mock('../runtime/server.js', () => ({ renderSiteDocument: vi.fn() }));
const roots: string[] = [];
beforeEach(async () => {
  rename.mockImplementation(
    (await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises'))
      .rename,
  );
  vi.mocked(loadSite).mockResolvedValue({
    origin: 'https://reacd.dev/',
    title: sitePayload.title,
    description: sitePayload.description,
    navigation: sitePayload.navigation,
    pages: [sitePayload.page],
  });
  vi.mocked(renderSiteDocument).mockReturnValue('<!doctype html><html></html>');
});
afterEach(async () => {
  await Promise.all(roots.map((root) => rm(root, { recursive: true, force: true })));
  roots.length = 0;
  vi.resetAllMocks();
});
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'reacd-build-site-'));
  roots.push(root);
  const assets = resolve(root, SITE_POLICY.runtimeDirectory, 'assets');
  await mkdir(assets, { recursive: true });
  await writeFile(join(assets, 'site.js'), 'runtime');
  await writeFile(join(assets, 'appearance.iife.js'), 'initial appearance');
  const runtime = resolve(root, SITE_POLICY.runtimeDirectory);
  await mkdir(join(runtime, '.vite'));
  await writeFile(
    join(runtime, SITE_POLICY.runtimeManifestPath),
    JSON.stringify({
      client: {
        file: 'assets/site.js',
        src: 'tooling/site/runtime/client.tsx',
        isEntry: true,
        dynamicImports: ['material'],
      },
      material: {
        file: 'assets/material.js',
        src: 'src/adapter/mui/mui.adapter.ts',
        isDynamicEntry: true,
      },
    }),
  );
  await writeFile(
    join(runtime, SITE_POLICY.runtimeModulesName),
    JSON.stringify({
      'assets/site.js': ['/repo/tooling/site/runtime/client.tsx'],
      'assets/material.js': ['/repo/node_modules/@mui/material/Button.js'],
    }),
  );
  await mkdir(join(root, 'tooling/site/public'), { recursive: true });
  await writeFile(join(root, 'tooling/site/public/logo.svg'), '<svg/>');
  await mkdir(join(root, 'tooling/site/public/fonts'));
  await writeFile(join(root, 'tooling/site/public/fonts/LICENSE.txt'), 'Font license');
  return root;
}
it('writes validated pages, source, assets and canonical metadata', async () => {
  const root = await fixture();
  await buildSite(root);
  const output = resolve(root, SITE_POLICY.outputDirectory);
  expect(await readFile(join(output, 'getting-started/index.html'), 'utf8')).toContain(
    '<!doctype html>',
  );
  const value: unknown = JSON.parse(
    await readFile(join(output, 'getting-started', SITE_POLICY.pageDataName), 'utf8'),
  );
  const data = sitePayloadSchema.parse(value);
  expect(data.page).toEqual(sitePayload.page);
  expect(await readFile(join(output, 'getting-started/index.md'), 'utf8')).toBe(
    sitePayload.page.source,
  );
  expect(await readFile(join(output, 'assets/site.js'), 'utf8')).toBe('runtime');
  expect(await readFile(join(output, 'logo.svg'), 'utf8')).toBe('<svg/>');
  expect(await readFile(join(output, 'CNAME'), 'utf8')).toBe('reacd.dev\n');
  expect(await readFile(join(output, 'sitemap.xml'), 'utf8')).toContain(
    'https://reacd.dev/getting-started/',
  );
  expect(await readFile(join(output, 'robots.txt'), 'utf8')).toContain(
    'Sitemap: https://reacd.dev/sitemap.xml',
  );
  await expect(
    readFile(join(output, SITE_POLICY.runtimeManifestPath)),
  ).rejects.toThrow();
  await expect(
    readFile(join(output, SITE_POLICY.runtimeModulesName)),
  ).rejects.toThrow();
  await buildSite(root);
  expect(await readFile(join(output, 'assets/site.js'), 'utf8')).toBe('runtime');
});

it.each([
  '/assets/site.js',
  '/ASSETS/site.js',
  '/getting-started/index.json',
  '/getting-started/index.html',
  '/getting-started/index.md',
  '/logo.svg',
  '/fonts/LICENSE.txt',
  '/robots.txt',
  '/sitemap.xml',
  '/encoded%2f..%2fassets/site.js',
  '/runtime-modules.json',
  '/.vite/manifest.json',
])('rejects reserved output collisions before promotion: %s', async (href) => {
  const root = await fixture();
  const output = resolve(root, SITE_POLICY.outputDirectory);
  await mkdir(output, { recursive: true });
  await writeFile(join(output, 'good.txt'), 'previous verified output');
  const target = join(
    root,
    'docs',
    decodeURIComponent(new URL(href, sitePayload.origin).pathname),
  );
  await mkdir(resolve(target, '..'), { recursive: true });
  await writeFile(target, 'Untrusted replacement');
  vi.mocked(loadSite).mockResolvedValue({
    origin: sitePayload.origin,
    title: sitePayload.title,
    description: sitePayload.description,
    navigation: sitePayload.navigation,
    pages: [
      {
        ...sitePayload.page,
        sections: [
          {
            type: 'prose',
            key: 'prose:0',
            document: [
              { type: 'paragraph', children: [{ type: 'link', href, children: [] }] },
            ],
          },
        ],
      },
    ],
  });
  await expect(buildSite(root)).rejects.toThrow('Reserved documentation output');
  expect(await readFile(join(output, 'good.txt'), 'utf8')).toBe(
    'previous verified output',
  );
});

it('preserves previous good output when rendering or promotion fails', async () => {
  const root = await fixture();
  const output = resolve(root, SITE_POLICY.outputDirectory);
  await mkdir(output, { recursive: true });
  await writeFile(join(output, 'good.txt'), 'previous verified output');
  vi.mocked(renderSiteDocument).mockImplementationOnce(() => {
    throw new Error('Rendering failed');
  });
  await expect(buildSite(root)).rejects.toThrow('Rendering failed');
  expect(await readFile(join(output, 'good.txt'), 'utf8')).toBe(
    'previous verified output',
  );
  const actual = (
    await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises')
  ).rename;
  rename.mockImplementation(async (source, destination) => {
    if (source === resolve(root, SITE_POLICY.stagingDirectory)) {
      throw new Error('Promotion failed');
    }
    await actual(source, destination);
  });
  await expect(buildSite(root)).rejects.toThrow('Promotion failed');
  expect(await readFile(join(output, 'good.txt'), 'utf8')).toBe(
    'previous verified output',
  );
});

it('copies referenced source/assets through every nested prose container', async () => {
  const root = await fixture();
  await mkdir(join(root, 'docs/examples'), { recursive: true });
  await writeFile(
    join(root, 'docs/examples/button.tsx'),
    'export const name = "Button";',
  );
  await writeFile(join(root, 'docs/example-logo.svg'), '<svg>Logo</svg>');
  const link = {
    type: 'link',
    href: '/examples/button.tsx',
    children: [{ type: 'text', text: 'Source' }],
  } as const;
  const document: ProseDocument = [
    {
      type: 'paragraph',
      children: [
        link,
        { type: 'link', href: '/getting-started/', children: [] },
        { type: 'link', href: 'https://example.com', children: [] },
      ],
    },
    { type: 'image', src: '/example-logo.svg', alt: 'Logo' },
    { type: 'quote', children: [{ type: 'paragraph', children: [link] }] },
    {
      type: 'list',
      ordered: false,
      items: [{ children: [{ type: 'paragraph', children: [link] }] }],
    },
    { type: 'table', header: [[link]], rows: [[[link]]] },
  ];
  vi.mocked(loadSite).mockResolvedValue({
    origin: sitePayload.origin,
    title: sitePayload.title,
    description: sitePayload.description,
    navigation: sitePayload.navigation,
    pages: [
      {
        ...sitePayload.page,
        sections: [
          { type: 'prose', key: 'prose:0', document },
          { type: 'preview', key: 'preview:1', component: 'Button' },
        ],
      },
    ],
  });
  await buildSite(root);
  const output = resolve(root, SITE_POLICY.outputDirectory);
  expect(await readFile(join(output, 'examples/button.tsx'), 'utf8')).toContain(
    'export const name',
  );
  expect(await readFile(join(output, 'example-logo.svg'), 'utf8')).toBe(
    '<svg>Logo</svg>',
  );
});

it.each(['/examples/button.test.tsx', '/examples/tsconfig.json'])(
  'rejects references to private test or configuration sources %s',
  async (href) => {
    const root = await fixture();
    vi.mocked(loadSite).mockResolvedValue({
      origin: sitePayload.origin,
      title: sitePayload.title,
      description: sitePayload.description,
      navigation: sitePayload.navigation,
      pages: [
        {
          ...sitePayload.page,
          sections: [
            {
              type: 'prose',
              key: 'prose:0',
              document: [
                { type: 'paragraph', children: [{ type: 'link', href, children: [] }] },
              ],
            },
          ],
        },
      ],
    });
    await expect(buildSite(root)).rejects.toThrow('cannot be published');
  },
);

it.each([
  new Error('Permission denied'),
  Object.assign(new Error('Denied'), { code: 'EACCES' }),
  'Unknown filesystem failure',
])('propagates preservation failures without replacing output %s', async (failure) => {
  const root = await fixture();
  rename.mockRejectedValueOnce(failure);
  await expect(buildSite(root)).rejects.toBe(failure);
});

it('cleans staging when first publication cannot be promoted', async () => {
  const root = await fixture();
  const actual = (
    await vi.importActual<typeof import('node:fs/promises')>('node:fs/promises')
  ).rename;
  rename.mockImplementation(async (source, destination) => {
    if (source === resolve(root, SITE_POLICY.stagingDirectory)) {
      throw new Error('Cannot promote first output');
    }
    await actual(source, destination);
  });
  await expect(buildSite(root)).rejects.toThrow('Cannot promote first output');
  await expect(
    readFile(resolve(root, SITE_POLICY.stagingDirectory, 'index.html')),
  ).rejects.toThrow();
});
