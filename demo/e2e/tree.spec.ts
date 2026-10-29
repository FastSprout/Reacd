import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

const WIDTHS = [240, 320, 375, 600, 768, 1024, 1440, 1920];
const HEIGHT = 1000;
const TOLERANCE = 1;
const TARGET = 44;
const LONG_LABEL = 'Unbroken_reference_name_'.repeat(35);
const SELECTED_TEXT_COLOR = 'rgb(255, 255, 255)';

async function content(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
}
async function bounds(page: Page, tree: Locator) {
  const escaped = await tree.evaluate((element, tolerance) => {
    const outer = element.getBoundingClientRect();
    return Array.from(element.querySelectorAll('[role="treeitem"],button,span')).some(
      (child) => {
        const box = child.getBoundingClientRect();
        return (
          box.width > 0 &&
          (box.left < outer.left - tolerance || box.right > outer.right + tolerance)
        );
      },
    );
  }, TOLERANCE);
  expect(escaped).toBe(false);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) + TOLERANCE);
}
for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} deep tree at ${width}px, RTL and 200%`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await content(page, profile);
      await page.getByLabel('Tree item label').fill(LONG_LABEL);
      await page.getByRole('switch', { name: 'Deep tree hierarchy' }).check();
      await page.getByRole('button', { name: 'Expand sample hierarchy' }).click();
      await page.getByRole('switch', { name: 'Right to left tree' }).check();
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      const tree = page.getByRole('tree', { name: 'Reference hierarchy' });
      await expect(tree).toHaveCSS('direction', 'rtl');
      const leaf = tree.getByRole('treeitem', { name: LONG_LABEL, exact: true });
      await expect(leaf).toHaveAttribute('aria-level', '14');
      await bounds(page, tree);
      await leaf.focus();
      await page.keyboard.press('Space');
      await expect(leaf).toHaveAttribute('aria-selected', 'true');
      const disclosure = tree.getByRole('button', { name: 'Collapse Reference' });
      const box = await disclosure.boundingBox();
      if (box === null) throw new Error('Missing tree disclosure geometry.');
      expect(box.width).toBeGreaterThanOrEqual(TARGET);
      expect(box.height).toBeGreaterThanOrEqual(TARGET);
      await page.getByRole('switch', { name: 'Readonly tree transitions' }).check();
      await expect(disclosure).toBeDisabled();
      await bounds(page, tree);
    });
  }
  test(`${profile} tree keyboard, selection and host controls`, async ({ page }) => {
    await content(page, profile);
    const tree = page.getByRole('tree', { name: 'Reference hierarchy' });
    const reference = tree.getByRole('treeitem', { name: 'Reference', exact: true });
    await reference.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect(
      tree.getByRole('treeitem', { name: 'Architecture', exact: true }),
    ).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    const state = tree.getByRole('treeitem', { name: 'State', exact: true });
    await expect(state).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(state).toHaveAttribute('aria-selected', 'true');
    await expect(state).toHaveCSS('color', SELECTED_TEXT_COLOR);
    await page.getByRole('switch', { name: 'Multiple tree selection' }).check();
    await tree.getByRole('treeitem', { name: 'Architecture', exact: true }).click();
    await tree.getByRole('treeitem', { name: 'Guides', exact: true }).click();
    await expect(
      page.getByText('Selected entries: architecture, guides', { exact: true }),
    ).toBeVisible();
    const draft = tree.getByRole('treeitem', {
      name: 'Unpublished draft',
      exact: true,
    });
    await expect(draft).toBeDisabled();
    const draftBox = await draft.boundingBox();
    if (draftBox === null) throw new Error('Missing disabled tree row geometry.');
    await page.mouse.click(
      draftBox.x + draftBox.width / 2,
      draftBox.y + draftBox.height / 2,
    );
    await expect(
      page.getByText('Selected entries: architecture, guides', { exact: true }),
    ).toBeVisible();
    await page.getByRole('switch', { name: 'Disable tree' }).check();
    await expect(tree).toHaveAttribute('aria-disabled', 'true');
  });
}
