import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { expectUnsupportedDiagnostic } from '../native-capabilities.js';
import { watchPreviewFailures } from '../preview-failures.js';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 320, 375, 600, 768, 1024, 1440, 1920];
const HEIGHT = 1000;
const TOLERANCE = 1;

async function select(page: Page, name: string, option: string) {
  await page.getByRole('combobox', { name, exact: true }).click();
  await page.getByRole('option', { name: option, exact: true }).click();
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} native loading and empty recovery at ${width}px and 200%`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      const failures = watchPreviewFailures(page);
      await page.goto('/');
      await select(page, 'Appearance', profile);
      await page
        .getByRole('button', {
          name: 'Content and data',
          exact: true,
        })
        .click();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
        document.documentElement.dir = 'rtl';
      });
      const status = page.getByRole('status', {
        name: 'Loading profile',
        exact: true,
      });
      await expect(status).toBeVisible();
      const material = test.info().project.name === 'mui';
      const placeholders = status.locator(
        material ? '.MuiSkeleton-text' : '[data-slot="skeleton"]',
      );
      await expect(placeholders).toHaveCount(2);
      for (const placeholder of await placeholders.all()) {
        const outer = await status.boundingBox();
        const inner = await placeholder.boundingBox();
        if (!outer || !inner) throw new Error('Missing native loading geometry.');
        expect(inner.width).toBeGreaterThan(0);
        expect(inner.height).toBeGreaterThan(0);
        expect(inner.x).toBeGreaterThanOrEqual(outer.x - TOLERANCE);
        expect(inner.x + inner.width).toBeLessThanOrEqual(
          outer.x + outer.width + TOLERANCE,
        );
      }
      if (material) {
        await expect(page.locator('.MuiSkeleton-circular')).toHaveCount(1);
        await expectUnsupportedDiagnostic(page, failures, 'Empty', 'Empty');
        await expect(page.getByRole('button', { name: 'Create project' })).toHaveCount(
          0,
        );
      } else {
        const empty = page.getByRole('region', { name: 'No projects yet' });
        await expect(empty).toBeVisible();
        await expect(empty).toHaveAttribute('aria-busy', 'false');
        const action = empty.getByRole('button', { name: 'Create project' });
        await action.focus();
        await page.keyboard.press('Enter');
        await expect(empty).toHaveCount(0);
        await expect(page.getByText('Your first project is ready.')).toBeVisible();
        await select(
          page,
          'Appearance',
          profile === 'Spacious' ? 'Compact' : 'Spacious',
        );
        await expect(
          page.getByRole('heading', { name: 'Website redesign' }),
        ).toBeVisible();
        await expect(status).toBeVisible();
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width + TOLERANCE);
    });
  }
}
