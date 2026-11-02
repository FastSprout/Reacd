import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { hydrateSite } from './hydration.js';
import { renderSiteFailure } from './recovery.js';
import type { SiteHost } from './actions.js';

vi.mock('./hydration.js', () => ({ hydrateSite: vi.fn() }));
vi.mock('./recovery.js', () => ({ renderSiteFailure: vi.fn() }));
beforeEach(() => {
  vi.resetModules();
  vi.mocked(hydrateSite).mockReset().mockResolvedValue(undefined);
  vi.mocked(renderSiteFailure).mockReset();
});
afterEach(() => vi.restoreAllMocks());

it('starts the browser entry and preserves hydrated content', async () => {
  await import('./client.js');
  expect(hydrateSite).toHaveBeenCalledWith(window);
  expect(renderSiteFailure).not.toHaveBeenCalled();
});

it('replaces only the failed application and delegates recovery reload', async () => {
  const { startSite } = await import('./client.js');
  const reload = vi.fn();
  const host: SiteHost = {
    document,
    fetch: window.fetch,
    navigator,
    localStorage,
    matchMedia: window.matchMedia,
    location: { href: 'https://reacd.dev/', reload },
  };
  vi.mocked(hydrateSite).mockRejectedValueOnce(new Error('Invalid page data'));
  await startSite(host);
  expect(renderSiteFailure).toHaveBeenCalledWith(document, expect.any(Function));
  vi.mocked(renderSiteFailure).mock.calls.at(-1)?.[1]();
  expect(reload).toHaveBeenCalledWith();
});
