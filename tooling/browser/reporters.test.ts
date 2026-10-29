import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

const LOCAL_REPORTERS = [['list'], ['html', { open: 'never' }]];

it.each([undefined, '', 'false', 'TRUE', '1', ' true', 'true '])(
  'keeps local reporters for GITHUB_ACTIONS=%s despite generic CI',
  async (flag) => {
    vi.stubEnv('GITHUB_ACTIONS', flag);
    vi.stubEnv('CI', 'true');
    vi.resetModules();
    const configuration = (await import('../../playwright.config.js')).default;
    expect(configuration.reporter).toEqual(LOCAL_REPORTERS);
    expect(configuration.workers).toBe(2);
    expect(configuration.retries).toBe(0);
  },
);

it('adds GitHub annotations only for the literal hosted runner flag', async () => {
  vi.stubEnv('GITHUB_ACTIONS', 'true');
  vi.stubEnv('CI', 'false');
  vi.resetModules();
  const configuration = (await import('../../playwright.config.js')).default;
  expect(configuration.reporter).toEqual([...LOCAL_REPORTERS, ['github']]);
  expect(configuration.workers).toBe(2);
  expect(configuration.retries).toBe(0);
});
