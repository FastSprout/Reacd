import { renderToString } from 'react-dom/server';
import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { COLOR_MODE_POLICY } from '../../../src/core/color-mode-policy.js';
import { watchPageErrors } from '../docs-site.js';
import {
  IMAGE_HYDRATION_ALT,
  IMAGE_HYDRATION_PREFIX,
  IMAGE_HYDRATION_SOURCES,
  imageHydrationView,
} from '../image-hydration-view.js';

const HOST_WIDTH = 144;
const TEXT_SCALE = 2;
const TOLERANCE = 1;

async function textFont(feedback: Locator) {
  return feedback.evaluate((element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
      if (node.textContent?.trim() && node.parentElement)
        return Number.parseFloat(getComputedStyle(node.parentElement).fontSize);
    }
    throw new Error('Missing native Image failure text.');
  });
}

test('failed Image text fits a narrow embed at 200% text', async ({ page }, info) => {
  const adapter = info.project.name;
  if (adapter !== 'mui' && adapter !== 'shadcn')
    throw new Error('Image layout requires a native adapter project.');
  const errors = watchPageErrors(page);
  const markup = renderToString(imageHydrationView({ adapter, source: 'failed' }), {
    identifierPrefix: IMAGE_HYDRATION_PREFIX,
  });
  await page.route(`**${IMAGE_HYDRATION_SOURCES.failed}`, (route) =>
    route.fulfill({ status: 404, contentType: 'image/svg+xml', body: '' }),
  );
  await page.route((url) => url.pathname === '/image-hydration.html', async (route) => {
    const response = await route.fetch();
    const html = await response.text();
    const placeholder = '<div id="root"></div>';
    if (!html.includes(placeholder)) throw new Error('Missing Image layout root.');
    const host = `<div id="root" style="width:${HOST_WIDTH}px">${markup}</div>`;
    const after = '<p id="after">Following content</p>';
    await route.fulfill({ response,
      body: html.replace(placeholder, host + after)
        .replace('<html lang="en">', '<html lang="en" style="font-size:200%">'),
    });
  });
  await page.goto(`/image-hydration.html?adapter=${adapter}&source=failed`);
  const original = page.locator(`img[alt="${IMAGE_HYDRATION_ALT}"]`);
  await expect.poll(() => original.evaluate((element) => {
    if (!(element instanceof HTMLImageElement)) throw new Error('Expected image.');
    return element.complete && element.naturalWidth === 0;
  })).toBe(true);
  await expect.poll(() => page.evaluate(() => typeof window.hydrateImage))
    .toBe('function');
  await page.evaluate(() => {
    if (!window.hydrateImage) throw new Error('Hydration entry is not ready.');
    window.hydrateImage();
  });
  const feedback = page.getByRole('img', { name: IMAGE_HYDRATION_ALT, exact: true });
  await expect(feedback).toHaveAccessibleDescription(COLOR_MODE_POLICY.imageFallback);
  await expect(feedback).toHaveText(COLOR_MODE_POLICY.imageFallback);
  await expect(feedback.locator('..')).toHaveAttribute('aria-busy', 'false');
  await expect(original).toHaveCount(0);
  const scaledFont = await textFont(feedback);
  await page.locator('html').evaluate((element) => {
    element.style.fontSize = '100%';
  });
  const normalFont = await textFont(feedback);
  await page.locator('html').evaluate((element) => {
    element.style.fontSize = '200%';
  });
  expect(scaledFont).toBeCloseTo(normalFont * TEXT_SCALE, 1);
  const geometry = await feedback.evaluate((element) => {
    const host = document.getElementById('root');
    const after = document.getElementById('after');
    if (!host || !after) throw new Error('Missing normal-flow Image layout proof.');
    const bounds = (node: Element) => {
      const { left, right, top, bottom } = node.getBoundingClientRect();
      return { left, right, top, bottom };
    };
    const glyphs = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
      const text = node.textContent ?? '';
      for (let index = 0; index < text.length; index += 1) {
        if (!text[index]?.trim()) continue;
        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + 1);
        for (const rect of range.getClientRects()) {
          if (rect.width === 0 || rect.height === 0) continue;
          const { left, right, top, bottom } = rect;
          glyphs.push({ left, right, top, bottom });
        }
      }
    }
    return { host: bounds(host), feedback: bounds(element), after: bounds(after),
      glyphs };
  });
  expect(geometry.host.right - geometry.host.left).toBe(HOST_WIDTH);
  expect(geometry.glyphs.length).toBeGreaterThan(0);
  for (const glyph of geometry.glyphs) {
    for (const box of [geometry.feedback, geometry.host]) {
      expect(glyph.left).toBeGreaterThanOrEqual(box.left - TOLERANCE);
      expect(glyph.right).toBeLessThanOrEqual(box.right + TOLERANCE);
      expect(glyph.top).toBeGreaterThanOrEqual(box.top - TOLERANCE);
      expect(glyph.bottom).toBeLessThanOrEqual(box.bottom + TOLERANCE);
    }
    expect(glyph.bottom).toBeLessThanOrEqual(geometry.after.top + TOLERANCE);
  }
  expect(geometry.host.bottom).toBeLessThanOrEqual(geometry.after.top + TOLERANCE);
  expect(await page.evaluate(() => window.imageHydrationErrors)).toEqual([]);
  expect(errors).toEqual([]);
});
