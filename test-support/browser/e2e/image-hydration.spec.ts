import { renderToString } from 'react-dom/server';
import { expect, test } from '@playwright/test';
import { COLOR_MODE_POLICY } from '../../../src/core/color-mode-policy.js';
import { watchPageErrors } from '../docs-site.js';
import {
  IMAGE_HYDRATION_ALT,
  IMAGE_HYDRATION_PREFIX,
  IMAGE_HYDRATION_SOURCES,
  imageHydrationView,
} from '../image-hydration-view.js';

for (const source of ['loaded', 'failed'] as const) {
  test(`reconciles a genuinely ${source} Image before hydration`, async ({
    page,
  }, info) => {
    const adapter = info.project.name;
    if (adapter !== 'mui' && adapter !== 'shadcn')
      throw new Error('Image hydration requires a native adapter project.');
    const errors = watchPageErrors(page);
    const markup = renderToString(imageHydrationView({ adapter, source }), {
      identifierPrefix: IMAGE_HYDRATION_PREFIX,
    });
    if (source === 'failed') {
      await page.route(`**${IMAGE_HYDRATION_SOURCES.failed}`, (route) =>
        route.fulfill({ status: 404, contentType: 'image/svg+xml', body: '' }),
      );
    }
    await page.route(
      (url) => url.pathname === '/image-hydration.html',
      async (route) => {
        const response = await route.fetch();
        const html = await response.text();
        const placeholder = '<div id="root"></div>';
        if (!html.includes(placeholder))
          throw new Error('Missing hydration host root.');
        await route.fulfill({ response,
          body: html.replace(placeholder, `<div id="root">${markup}</div>`),
        });
      },
    );
    await page.goto(`/image-hydration.html?adapter=${adapter}&source=${source}`);
    await expect(page.locator('[data-adapter]').first()).toHaveAttribute(
      'data-adapter', adapter === 'mui' ? 'material-ui' : 'shadcn-ui',
    );
    const image = page.getByRole('img', { name: IMAGE_HYDRATION_ALT, exact: true });
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((element) => {
      if (!(element instanceof HTMLImageElement)) throw new Error('Expected image.');
      return element.complete;
    })).toBe(true);
    const naturalWidth = await image.evaluate((element) => {
      if (!(element instanceof HTMLImageElement)) throw new Error('Expected image.');
      return element.naturalWidth;
    });
    if (source === 'loaded') expect(naturalWidth).toBeGreaterThan(0);
    else expect(naturalWidth).toBe(0);
    await expect(image.locator('..')).toHaveAttribute('aria-busy', 'true');
    const original = await image.elementHandle();
    if (!original) throw new Error('Missing server-rendered image.');
    await expect.poll(() => page.evaluate(() => typeof window.hydrateImage))
      .toBe('function');
    await page.evaluate(() => {
      if (!window.hydrateImage) throw new Error('Hydration entry is not ready.');
      window.hydrateImage();
    });
    const rendered = page.getByRole('img', { name: IMAGE_HYDRATION_ALT, exact: true });
    await expect(rendered.locator('..')).toHaveAttribute('aria-busy', 'false');
    if (source === 'loaded') {
      expect(await rendered.evaluate((element, first) => element === first, original))
        .toBe(true);
    } else {
      await expect(rendered)
        .toHaveAccessibleDescription(COLOR_MODE_POLICY.imageFallback);
      await expect(rendered).toHaveText(COLOR_MODE_POLICY.imageFallback);
      await expect(page.locator(`img[alt="${IMAGE_HYDRATION_ALT}"]`)).toHaveCount(0);
    }
    await original.dispose();
    expect(await page.evaluate(() => window.imageHydrationErrors)).toEqual([]);
    expect(errors).toEqual([]);
  });
}
