import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const PROFILES = ['Spacious', 'Compact'];
const WIDTHS = [240, 320, 375, 600, 768, 1024, 1440, 1920];
const HEIGHT = 1000;
const TOLERANCE = 1;
async function select(page: Page, name: string, option: string) {
  const trigger = page.getByRole('combobox', { name, exact: true });
  await trigger.click();
  await page.getByRole('option', { name: option, exact: true }).click();
  await expect(trigger).toBeFocused();
}
async function data(page: Page, profile: string) {
  await page.goto('/');
  await select(page, 'Appearance', profile);
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
}
async function contained(page: Page) {
  const width = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(width.document).toBeLessThanOrEqual(width.viewport + TOLERANCE);
  const failures = await page.locator('.reacd-avatar, .reacd-avatar-count').evaluateAll(
    (elements, tolerance): string[] =>
      elements.flatMap<string>((element) => {
        const box = element.getBoundingClientRect();
        if (box.width === 0) return [];
        const parent = element.parentElement?.getBoundingClientRect();
        const fallback = element.querySelector('.reacd-avatar-fallback') ?? element;
        const range = document.createRange();
        range.selectNodeContents(fallback);
        const text = range.getBoundingClientRect();
        return parent === undefined ||
          Math.abs(box.width - box.height) > tolerance ||
          box.right > parent.right + tolerance ||
          box.left < parent.left - tolerance ||
          (text.width > 0 &&
            (text.left < box.left - tolerance ||
              text.right > box.right + tolerance ||
              text.top < box.top - tolerance ||
              text.bottom > box.bottom + tolerance))
          ? ['Avatar or count escaped its square footprint.']
          : [];
      }),
    TOLERANCE,
  );
  expect(failures).toEqual([]);
}

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    test(`${profile} avatar initials and overflow fit at ${width}px and 200%`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await data(page, profile);
      await page.getByLabel('Avatar name', { exact: true }).fill('W W');
      await select(page, 'Avatar size', 'Small');
      await page.getByRole('switch', { name: 'Use maximum-size group' }).check();
      await select(page, 'Group avatar size', 'Large');
      await page.getByRole('slider', { name: /^Visible people/ }).focus();
      await page.keyboard.press('Home');
      await expect(page.getByText('Show 99 more people')).toBeVisible();
      await contained(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await contained(page);
      await page.getByText('Show 99 more people').click();
      await page.getByText('Placeholder 100', { exact: true }).scrollIntoViewIfNeeded();
      await expect(page.getByText('Placeholder 100', { exact: true })).toBeInViewport();
      await contained(page);
    });
  }
  test(`${profile} avatar recovery, Unicode, disclosure, and themes`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await data(page, profile);
    const preview = page.getByRole('region', { name: 'Avatar preview', exact: true });
    const group = page.getByRole('group', { name: 'Reviewer placeholders' });
    await page.getByLabel('Avatar name', { exact: true }).fill('👩‍💻');
    await expect(preview.getByRole('img', { name: '👩‍💻' })).toContainText('👩‍💻');
    await select(page, 'Avatar source', 'Local placeholder image');
    const image = preview.locator('img');
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate((element) =>
          element instanceof HTMLImageElement ? element.naturalWidth : 0,
        ),
      )
      .toBeGreaterThan(0);
    await expect(preview.locator('.reacd-avatar-fallback')).toHaveCount(0);
    const before = await preview.getByRole('img').boundingBox();
    await select(page, 'Avatar source', 'Undecodable image');
    await expect(image).toHaveAttribute('data-error', '');
    await expect(preview.locator('.reacd-avatar-fallback')).toHaveText('👩‍💻');
    const after = await preview.getByRole('img').boundingBox();
    if (before === null || after === null) throw new Error('Missing avatar geometry.');
    expect(after.width).toBe(before.width);
    expect(after.height).toBe(before.height);
    await select(page, 'Avatar source', 'Local placeholder image');
    await image.scrollIntoViewIfNeeded();
    await expect(preview.locator('.reacd-avatar-fallback')).toHaveCount(0);
    const summary = group.locator('summary');
    await summary.focus();
    await page.keyboard.press('Enter');
    const observer = group.getByText('👩‍💻 Example Observer', { exact: true });
    await expect(observer).toBeVisible();
    await select(page, 'Appearance', profile === 'Spacious' ? 'Compact' : 'Spacious');
    await expect(group.locator('details')).toHaveAttribute('open', '');
    await expect(page.getByLabel('Avatar name', { exact: true })).toHaveValue('👩‍💻');
    await page.getByRole('switch', { name: 'Empty avatar group' }).check();
    await expect(group.getByText('Nobody assigned in this example.')).toBeVisible();
    await page.getByRole('switch', { name: 'Empty avatar group' }).uncheck();
    await expect(group.getByText('Show 2 more people')).toBeVisible();
    expect(errors).toEqual([]);
  });
}
