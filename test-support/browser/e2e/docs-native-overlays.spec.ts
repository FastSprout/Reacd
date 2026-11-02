import { expect, test } from '@playwright/test';
import { expectContained, loadedPreview, watchPageErrors } from '../docs-site.js';

for (const width of [375, 1920]) {
  test(`profile modal saves and returns focus at ${width}px`, async ({ page }) => {
    const errors = watchPageErrors(page);
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/components/modal/');
    const preview = await loadedPreview(page);
    const trigger = preview.getByRole('button', { name: 'Edit profile' });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Edit profile', exact: true });
    const field = dialog.getByRole('textbox', { name: 'Display name' });
    await field.fill('Grace Hopper');
    await dialog.getByRole('button', { name: 'Save profile' }).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(preview.getByText('Saved name: Grace Hopper', { exact: true }))
      .toBeVisible();
    await trigger.click();
    await expect(field).toHaveValue('Grace Hopper');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expectContained(page);
    expect(errors).toEqual([]);
  });
}

for (const width of [375, 1440]) {
  for (const component of ['drawer', 'slideover']) {
    test(`${component} modal focus and retention at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      const errors = watchPageErrors(page);
      await page.goto(`/components/${component}/`);
      const preview = await loadedPreview(page);
      const title = `Sample ${component}`;
      const trigger = preview.getByRole('button', { name: `Open sample ${component}` });
      await trigger.click();
      const dialog = page.getByRole('dialog', { name: title, exact: true });
      await expect(dialog).toBeVisible();
      await expect.poll(async () => {
        const bounds = await dialog.boundingBox();
        if (!bounds) throw new Error('Missing native panel geometry.');
        return Math.max(-bounds.x, -bounds.y,
          bounds.x + bounds.width - width, bounds.y + bounds.height - 1000);
      }).toBeLessThanOrEqual(2);
      const field = dialog.getByRole('textbox', {
        name: `${component === 'drawer' ? 'Drawer' : 'Slideover'} note`,
      });
      await field.fill('Retained native note');
      for (let index = 0; index < 5; index += 1) {
        await page.keyboard.press('Tab');
        await expect.poll(() => dialog.evaluate((element) =>
          element.contains(document.activeElement))).toBe(true);
      }
      const scroll = await page.evaluate(() => scrollY);
      await page.mouse.move(4, 4);
      await page.mouse.wheel(0, 500);
      await page.evaluate(() => new Promise(requestAnimationFrame));
      expect(await page.evaluate(() => scrollY)).toBe(scroll);
      await dialog.getByRole('button', { name: 'Close', exact: true }).click();
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
      await trigger.click();
      await expect(field).toHaveValue('Retained native note');
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expectContained(page);
      expect(errors).toEqual([]);
    });
  }
}

test('native popover saves state and restores its trigger', async ({ page }) => {
  const errors = watchPageErrors(page);
  await page.setViewportSize({ width: 375, height: 1000 });
  await page.goto('/components/popover/');
  const preview = await loadedPreview(page);
  const trigger = preview.getByRole('button', { name: 'Add delivery note' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Delivery instructions' });
  await dialog.getByRole('textbox', { name: 'Delivery note' }).fill('Reception');
  await dialog.getByRole('button', { name: 'Save note' }).click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  const saved = preview.getByText('Saved note: Reception', { exact: true });
  await expect(saved).toBeVisible();
  await expectContained(page);
  expect(errors).toEqual([]);
});
