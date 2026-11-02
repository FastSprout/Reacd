import { beforeEach, expect, it, vi } from 'vitest';
import { hydrateRoot } from 'react-dom/client';
import { sitePayload } from '../../../test-support/site-payload.js';
import { hydrateSite } from './hydration.js';
import type { SiteHost } from './actions.js';
import { SITE_POLICY } from '../policy.js';

vi.mock('react-dom/client', () => ({ hydrateRoot: vi.fn() }));
beforeEach(() => vi.clearAllMocks());

function fixture(href: string) {
  const fetch = vi
    .fn<typeof window.fetch>()
    .mockResolvedValue(new Response(JSON.stringify(sitePayload)));
  const host: SiteHost = {
    document,
    fetch,
    navigator,
    localStorage,
    matchMedia: window.matchMedia,
    location: { href, reload: vi.fn() },
  };
  return { host, fetch };
}

it.each(['/getting-started/', '/getting-started', '/getting-started/index.html'])(
  'fetches page data and hydrates the full document for %s',
  async (path) => {
    const { host, fetch } = fixture(`https://reacd.dev${path}?query=1#install`);
    await hydrateSite(host);
    const request = fetch.mock.calls[0]?.[0];
    expect(request).toBeInstanceOf(URL);
    if (!(request instanceof URL)) throw new Error('Expected a page data URL');
    expect(request.href).toBe('https://reacd.dev/getting-started/index.json');
    expect(hydrateRoot).toHaveBeenCalledWith(document, expect.anything(), {
      identifierPrefix: SITE_POLICY.rootIdentifier,
    });
  },
);

it('does not hydrate failed, invalid, or mismatched page data', async () => {
  const { host, fetch } = fixture('https://reacd.dev/getting-started/');
  fetch.mockResolvedValueOnce(new Response('Unavailable', { status: 503 }));
  await expect(hydrateSite(host)).rejects.toThrow('could not be loaded');
  fetch.mockResolvedValueOnce(new Response('Not JSON'));
  await expect(hydrateSite(host)).rejects.toThrow();
  fetch.mockResolvedValueOnce(new Response('{"page":{"html":"<script>"}}'));
  await expect(hydrateSite(host)).rejects.toThrow();
  fetch.mockResolvedValueOnce(
    new Response(
      JSON.stringify({
        ...sitePayload,
        page: { ...sitePayload.page, route: '/different/' },
      }),
    ),
  );
  await expect(hydrateSite(host)).rejects.toThrow('does not match');
  expect(hydrateRoot).not.toHaveBeenCalled();
});

it('hydrates the same trusted startup source and painted styles', async () => {
  const script = document.createElement('script');
  const style = document.createElement('style');
  script.id = SITE_POLICY.appearanceScriptId;
  script.textContent = '/* Trusted build output */';
  style.id = SITE_POLICY.initialDesignId;
  style.textContent = 'html{color-scheme:dark}';
  document.head.append(script, style);
  try {
    await hydrateSite(fixture('https://reacd.dev/getting-started/').host);
    const props: unknown = expect.objectContaining({
      appearanceScript: script.textContent,
      initialStyles: style.textContent,
    });
    expect(hydrateRoot).toHaveBeenCalledWith(
      document,
      expect.objectContaining({ props }),
      expect.anything(),
    );
  } finally {
    script.remove();
    style.remove();
  }
});
