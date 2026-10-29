import { readFileSync, readdirSync } from 'node:fs';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from '@playwright/test';
import { Editor, ReacdProvider, Theme, templates } from '../../src/index.js';
import { templateSchema } from '../../src/schema/design/templates.schema.js';

const SPACING_REM = 4;
const VIEWPORT = { width: 240, height: 1000 };
const TOLERANCE = 1;
const TEXT = 'Unbroken_editor_content_'.repeat(20);
const stylesDirectory = new URL('../../demo-dist/assets/', import.meta.url);
const styles = readdirSync(stylesDirectory).filter((name) => name.endsWith('.css'))
  .map((name) => readFileSync(new URL(name, stylesDirectory), 'utf8')).join('\n');

for (const profile of ['saas-modern-light', 'erp-compact'] as const) {
  test(`${profile} valid maximum-spacing editor SSR fits at 200%`, async ({ page }) => {
    const template = templateSchema.parse({ ...templates[profile], spacing: {
      small: SPACING_REM, medium: SPACING_REM, large: SPACING_REM,
    } });
    const html = renderToString(createElement(ReacdProvider, null,
      createElement(Theme, { template }, createElement(Editor, {
        label: 'Template boundary', value: { version: 1, blocks: [
          { type: 'paragraph', id: 'intro', content: [{ type: 'text', text: TEXT }] },
        ] }, onValueChange: () => undefined,
      }))));
    await page.setViewportSize(VIEWPORT);
    await page.setContent(`<style>${styles}html{font-size:200%}</style>${html}`);
    await expect(page.getByRole('region', { name: 'Template boundary preview' }))
      .toContainText(TEXT);
    expect(await page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(VIEWPORT.width + TOLERANCE);
    expect(await page.locator('.reacd-editor-preview').evaluate((element, tolerance) =>
      element.scrollWidth <= element.clientWidth + tolerance, TOLERANCE)).toBe(true);
  });
}
