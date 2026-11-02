import { expect, test } from '@playwright/test';
import { DOCS_BROWSER_POLICY as POLICY, watchPageErrors } from '../docs-site.js';

test('header, native search and Ctrl/Meta K preserve focus and query state', async ({
  page,
}) => {
  const errors = watchPageErrors(page);
  await page.goto('/components/button/');
  const header = page.getByRole('banner');
  const trigger = header.getByRole('button', { name: 'Search documentation' });
  await trigger.click();
  const dialog = page.getByRole('dialog', {
    name: 'Search documentation',
    exact: true,
  });
  const query = dialog.getByRole('combobox', { name: 'Search documentation' });
  await expect(query).toBeFocused();
  await query.fill('Grid');
  await expect(dialog.getByRole('option', { name: /Grid/ }).first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  for (const modifier of ['Control', 'Meta']) {
    await page.keyboard.press(`${modifier}+k`);
    await expect(query).toBeFocused();
    await expect(query).toHaveValue('Grid');
    await page.keyboard.press(`${modifier}+k`);
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  }
  await trigger.click();
  await dialog.getByRole('button', { name: 'Close search' }).click();
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test('desktop navigation filters groups and follows a declared page', async ({
  page,
}) => {
  await page.setViewportSize(POLICY.desktop);
  await page.goto('/components/button/');
  const filter = page.getByRole('textbox', { name: 'Filter navigation', exact: true });
  const navigation = page.getByRole('navigation', {
    name: 'Documentation navigation',
    exact: true,
  });
  await filter.fill('Grid');
  await expect(
    navigation.getByRole('link', { name: 'Grid', exact: true }),
  ).toBeVisible();
  await expect(
    navigation.getByRole('link', { name: 'Button', exact: true }),
  ).toHaveCount(0);
  await filter.fill('');
  await expect(
    navigation.getByRole('link', { name: 'Button', exact: true }),
  ).toHaveAttribute('aria-current', 'location');
  await navigation.getByRole('link', { name: 'Grid', exact: true }).click();
  await expect(page).toHaveURL(`${POLICY.origin}/components/grid/`);
  await expect(
    page.getByRole('heading', { name: 'Grid', level: 1, exact: true }),
  ).toBeVisible();
});

test('numeric changelog table-of-contents links preserve real heading anchors', async ({
  page,
}) => {
  const errors = watchPageErrors(page);
  await page.setViewportSize(POLICY.desktop);
  await page.goto('/changelog/');
  const toc = page.getByRole('navigation', { name: 'On this page', exact: true });
  const version = toc.getByRole('link', { name: /^0\.3\.0/ });
  const href = await version.getAttribute('href');
  expect(href).toMatch(/^#\d/);
  await version.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  const heading = page.getByRole('heading', { name: /^0\.3\.0/, level: 2 });
  await expect(heading).toBeInViewport();
  const target = await heading.boundingBox();
  const header = await page.getByRole('banner').boundingBox();
  if (!target || !header) throw new Error('Missing anchor target or header');
  expect(target.y + POLICY.overflowTolerance).toBeGreaterThanOrEqual(
    header.y + header.height,
  );
  expect(await heading.getAttribute('id')).toBe(href?.slice(1));
  expect(errors).toEqual([]);
});

test('phone navigation follows local links through the SDK sheet', async ({ page }) => {
  const errors = watchPageErrors(page);
  await page.setViewportSize(POLICY.phone);
  await page.goto('/components/button/');
  const trigger = page.getByRole('button', { name: 'Open navigation', exact: true });
  await trigger.click();
  const menu = page.getByRole('dialog', { name: 'reacd', exact: true });
  await expect(menu).toBeVisible();
  await menu
    .getByRole('textbox', { name: 'Filter navigation', exact: true })
    .fill('Grid');
  await menu.getByRole('link', { name: 'Grid', exact: true }).click();
  await expect(page).toHaveURL(`${POLICY.origin}/components/grid/`);
  await expect(
    page.getByRole('heading', { name: 'Grid', level: 1, exact: true }),
  ).toBeVisible();
  await expect(menu).toBeHidden();
  expect(errors).toEqual([]);
});

test('restores the focused navigation field after Ctrl or Meta K', async ({ page }) => {
  const errors = watchPageErrors(page);
  await page.goto('/components/button/');
  const current = page.getByRole('textbox', { name: 'Filter navigation', exact: true });
  const dialog = page.getByRole('dialog', {
    name: 'Search documentation',
    exact: true,
  });
  for (const modifier of ['Control', 'Meta']) {
    await current.focus();
    await page.keyboard.press(`${modifier}+k`);
    await expect(dialog.getByRole('combobox')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(current).toBeFocused();
  }
  expect(errors).toEqual([]);
});
