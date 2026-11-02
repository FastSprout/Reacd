import { expect, test } from '@playwright/test';
import { openUnsupportedExample } from '../native-capabilities.js';

for (const profile of ['Spacious', 'Compact']) {
  for (const width of [240, 360, 768, 1440]) {
    test(`${profile} native time editing or exact gap at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      if (test.info().project.name === 'mui') {
        await openUnsupportedExample(page, profile, 'Fields', 'InputTime');
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
        });
        await expect(
          page.getByRole('spinbutton', { name: /Meeting time/ }),
        ).toHaveCount(0);
        return;
      }
      await page.goto('/');
      await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
      await page.getByRole('option', { name: profile, exact: true }).click();
      await page.getByRole('button', { name: 'Fields', exact: true }).click();
      const hour = page.getByRole('spinbutton', { name: /hour.*Meeting time/i });
      await expect(hour).toBeVisible();
      await hour.focus();
      await page.keyboard.press('ArrowUp');
      await expect(
        page.getByText('Meeting time: 10:00:00', { exact: true }),
      ).toBeVisible();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const field = page.getByRole('group', { name: 'Meeting time', exact: true });
      const box = await field.boundingBox();
      if (box === null) throw new Error('Missing native segmented field');
      const fits = await field.evaluate((element) => {
        const outer = element.getBoundingClientRect();
        return [...element.querySelectorAll('[role=spinbutton]')].every((segment) => {
          const bounds = segment.getBoundingClientRect();
          return bounds.left >= outer.left - 1 && bounds.right <= outer.right + 1;
        });
      });
      expect(fits).toBe(true);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width + 1);
      await page.getByRole('button', { name: 'Clear Meeting time' }).click();
      await expect(
        page.getByText('Choose a meeting time.', { exact: true }),
      ).toBeVisible();
    });
  }
}
