import { expect, it } from 'vitest';
import { renderSiteDocument, serverActions } from './server.js';
import { sitePayload } from '../../../test-support/site-payload.js';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { SiteDocument } from './document.js';
import { DEFAULT_DESIGN_PREFERENCES } from '../design/preferences.js';

it('generates semantic content and canonical metadata before scripts', () => {
  const html = renderSiteDocument(sitePayload);
  expect(html).toMatch(/^<!doctype html>/);
  const page = new DOMParser().parseFromString(html, 'text/html');
  expect(page.title).toBe('Get started · reacd');
  expect(page.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
    'https://reacd.dev/getting-started/',
  );
  expect(page.querySelector('[data-adapter="shadcn-ui"]')).not.toBeNull();
  expect(page.body.textContent).toContain('Use reacd components.');
  expect(page.querySelectorAll('h1, [role="heading"][aria-level="1"]')).toHaveLength(1);
  expect(page.querySelector('iframe')).toBeNull();
  expect(html).not.toMatch(/mkdocs|jinja|docs-shell|data-reacd-chrome/iu);
});

it('keeps server actions deterministic and free of browser side effects', async () => {
  expect(serverActions.readAppearance()).toBe('light');
  await expect(serverActions.copyText()).resolves.toBeUndefined();
  expect(serverActions.persistAppearance()).toBeUndefined();
});

it('places the trusted bootstrap before application markup and runtime', () => {
  const html = renderSiteDocument(sitePayload, 'window.__initialTheme = true;');
  const page = new DOMParser().parseFromString(html, 'text/html');
  expect(page.documentElement.getAttribute('data-reacd-boot')).toBe('');
  expect(page.querySelector('#reacd-appearance-start')?.textContent).toBe(
    'window.__initialTheme = true;',
  );
  expect(page.head.querySelector('#reacd-initial-design')?.textContent).toContain(
    'html[data-reacd-boot]',
  );
  expect(html.indexOf('window.__initialTheme')).toBeLessThan(html.indexOf('<body>'));
});

it('preserves the painted style snapshot across delayed hydration', () => {
  const html = renderToString(
    createElement(SiteDocument, {
      payload: sitePayload,
      appearanceScript: '',
      initialStyles: 'html{color-scheme:dark}',
      actions: {
        ...serverActions,
        readAppearance: () => {
          throw new Error('Do not reread preferences for painted markup');
        },
      },
    }),
  );
  const page = new DOMParser().parseFromString(html, 'text/html');
  expect(page.querySelector('#reacd-initial-design')?.textContent).toBe(
    'html{color-scheme:dark}',
  );
});

it('can prepare initial tokens from a supplied named design', () => {
  const html = renderToString(
    createElement(SiteDocument, {
      payload: sitePayload,
      appearanceScript: '',
      initialStyles: null,
      actions: { ...serverActions, readDesign: () => DEFAULT_DESIGN_PREFERENCES },
    }),
  );
  expect(html).toContain('--background:#ffffff!important');
});
