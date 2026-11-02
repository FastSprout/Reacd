import { expect, test } from '@playwright/test';
import {
  chooseAdapter,
  expectContained,
  loadedPreview,
  watchPageErrors,
} from '../docs-site.js';

const CONTENT =
  'The northern regional delivery schedule remains available for review.';

for (const width of [375, 1920]) {
  test(`native text disclosure stays accessible at ${width}px`, async ({ page }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/text/');
    const preview = await loadedPreview(page);
    for (const adapter of ['shadcn/ui', 'Material UI'] as const) {
      if (adapter === 'Material UI') await chooseAdapter(page, adapter);
      const trigger = preview.getByRole('button', { name: 'Full text', exact: true });
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await trigger.focus();
      await page.keyboard.press('Enter');
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await expect(preview.getByText(CONTENT, { exact: true })).toHaveCount(2);
      await expect(preview.getByText(CONTENT, { exact: true }).last()).toBeVisible();
      await expectContained(page);
      await page.keyboard.press('Space');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(preview.getByText(CONTENT, { exact: true })).toHaveCount(1);
    }
    expect(errors).toEqual([]);
  });
}

for (const component of ['link', 'navigation']) {
  test(`${component} wraps an unbroken label on phones`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 1000 });
    await page.goto(`/components/${component}/`);
    const preview = await loadedPreview(page);
    const target = component === 'link'
      ? preview.getByRole('link', { name: 'Current catalog', exact: true })
      : preview.getByRole('button', { name: 'Summary view', exact: true });
    // Only replace content: keep the generated SDK tree and layout rules intact.
    await target.evaluate((element) => {
      element.textContent = 'Navigation'.repeat(80);
    });
    const renamedTarget = preview.getByText('Navigation'.repeat(80), { exact: true });
    await expect.poll(() => renamedTarget.evaluate((element) =>
      element.scrollWidth - element.clientWidth,
    )).toBeLessThanOrEqual(2);
    await expectContained(page);
  });
}
