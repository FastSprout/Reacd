import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';
import { expectUnsupportedDiagnostic } from '../native-capabilities.js';
import { watchPreviewFailures } from '../preview-failures.js';

async function bounds(control: Locator, container: Locator) {
  const outer = await container.boundingBox();
  const inner = await control.boundingBox();
  expect(outer).not.toBeNull();
  expect(inner).not.toBeNull();
  if (!outer || !inner) throw new Error('Expected visible native content bounds.');
  expect(inner.x).toBeGreaterThanOrEqual(outer.x - 1);
  expect(inner.x + inner.width).toBeLessThanOrEqual(outer.x + outer.width + 1);
}

for (const width of [240, 360]) {
  test(`native content reflows at ${width}px and doubled text`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const failures = watchPreviewFailures(page);
    await page.goto('/');
    await page.getByRole('button', { name: 'Content and data', exact: true }).click();
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    const catalog = page.getByRole('region', {
      name: 'Component catalog',
      exact: true,
    });
    await bounds(
      page.getByRole('heading', {
        name: 'Component catalog',
        exact: true,
      }),
      catalog,
    );
    if (test.info().project.name === 'mui') {
      await expectUnsupportedDiagnostic(page, failures, 'Chat', 'ChatAttachment');
      await expect(
        page.getByRole('group', { name: 'example-reference.txt' }),
      ).toHaveCount(0);
      await expect(
        page.getByRole('button', { name: 'Jump to latest message' }),
      ).toHaveCount(0);
      return;
    }
    const attachment = page.getByRole('group', {
      name: 'example-reference.txt',
      exact: true,
    });
    const remove = attachment.getByRole('button', {
      name: 'Remove example-reference.txt',
      exact: true,
    });
    await expect(remove).toBeVisible();
    await bounds(attachment, catalog);
    await bounds(remove, attachment);
    expect(await remove.evaluate((node) => node.scrollWidth)).toBeLessThanOrEqual(
      (await remove.evaluate((node) => node.clientWidth)) + 1,
    );
    expect((await remove.boundingBox())?.height).toBeGreaterThanOrEqual(64);
    expect(await remove.evaluate((node) => node.scrollHeight)).toBeLessThanOrEqual(
      (await remove.evaluate((node) => node.clientHeight)) + 1,
    );
    const jump = page.getByRole('button', {
      name: 'Jump to latest message',
      exact: true,
    });
    await expect(jump).toBeVisible();
    await bounds(jump, catalog);
    expect(await jump.evaluate((node) => node.scrollWidth)).toBeLessThanOrEqual(
      (await jump.evaluate((node) => node.clientWidth)) + 1,
    );
    expect((await jump.boundingBox())?.height).toBeGreaterThanOrEqual(72);
    expect(await jump.evaluate((node) => node.scrollHeight)).toBeLessThanOrEqual(
      (await jump.evaluate((node) => node.clientHeight)) + 1,
    );
    await jump.focus();
    await expect(jump).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(jump).toBeFocused();
    await remove.click();
    await expect(attachment).toHaveCount(0);
  });
}
