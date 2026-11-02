import { expect, it, vi } from 'vitest';
import configuration from '../../playwright.config.js';

it('runs native PIN geometry in three explicit shadcn browser projects', () => {
  const projects = configuration.projects ?? [];
  expect(projects.slice(0, 2).map((project) => project.name)).toEqual([
    'mui',
    'shadcn',
  ]);
  for (const project of projects.slice(0, 2)) {
    expect(project.testIgnore).toEqual([
      '**/docs-*.spec.ts',
      '**/pin-readability.spec.ts',
    ]);
  }
  expect(projects.slice(2).map((project) => project.name)).toEqual([
    'pin-chromium',
    'pin-firefox',
    'pin-webkit',
  ]);
  for (const project of projects.slice(2)) {
    expect(project.testMatch).toBe('**/pin-readability.spec.ts');
    expect(project.use?.browserName).toBe(project.name?.replace('pin-', ''));
    expect(project.use?.permissions).toEqual(
      project.name === 'pin-chromium'
        ? ['clipboard-read', 'clipboard-write']
        : undefined,
    );
    expect(project.use?.storageState).toEqual({
      cookies: [],
      origins: [
        {
          origin: 'http://127.0.0.1:4174',
          localStorage: [
            {
              name: 'reacd-conformance-adapter',
              value: 'shadcn',
            },
          ],
        },
      ],
    });
  }
});

it.each(['true', 'false'])('preserves the GitHub reporter when CI=%s', async (ci) => {
  vi.stubEnv('GITHUB_ACTIONS', ci);
  vi.resetModules();
  try {
    const { default: configured } = await import('../../playwright.config.js');
    expect(configured.reporter).toEqual([
      ['list'],
      ['html', { open: 'never' }],
      ...(ci === 'true' ? [['github']] : []),
    ]);
  } finally {
    vi.unstubAllEnvs();
    vi.resetModules();
  }
});
