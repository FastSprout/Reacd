import { expect, test } from '@playwright/test';
import { TREE_POLICY } from '../../../src/core/tree-policy.js';

const WIDTHS = [240, 320, 768, 1440];
const PROFILES = ['Spacious', 'Compact'];
const DIRECTIONS = ['ltr', 'rtl'];
const HEIGHT = 1000;
const TOLERANCE = 1;
const LONG_LABEL = 'unbroken_document_group_'.repeat(24);

for (const profile of PROFILES) {
  for (const width of WIDTHS) {
    for (const direction of DIRECTIONS) {
      test(`${profile} content outlines ${width}px ${direction}`, async ({ page }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        await page.goto('/');
        await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
        await page.getByRole('option', { name: profile, exact: true }).click();
        await page.getByRole('button', { name: 'Navigation', exact: true }).click();
        if (direction === 'rtl')
          await page.getByRole('switch', { name: 'Right to left navigation' }).check();
        await page.evaluate(() => {
          document.documentElement.style.fontSize = '200%';
        });
        const navigation = page.getByRole('navigation', { name: 'Documentation tree' });
        await expect(navigation).toHaveCSS('direction', direction);
        await page.getByLabel('Documentation group title').fill(LONG_LABEL);
        const expand = navigation.getByRole('button', { name: `Expand ${LONG_LABEL}` });
        const intro = navigation.getByRole('link', { name: 'Navigation introduction' });
        await expect(intro).toHaveCount(0);
        await page
          .getByRole('switch', { name: 'Read-only document expansion' })
          .check();
        await expect(expand).toBeDisabled();
        await page
          .getByRole('switch', { name: 'Read-only document expansion' })
          .uncheck();
        await expand.focus();
        await page.keyboard.press('Enter');
        await expect(intro).toBeVisible();
        await page.keyboard.press('Tab');
        await expect(intro).toBeFocused();
        await expect(
          navigation.getByRole('link', { name: 'Unavailable document' }),
        ).toHaveAttribute('aria-disabled', 'true');
        await page.getByRole('switch', { name: 'Veto document activation' }).check();
        await intro.click();
        expect(new URL(page.url()).hash).toBe('');
        await expect(page.getByText('Current document: none')).toBeVisible();
        await page.getByRole('switch', { name: 'Veto document activation' }).uncheck();
        await intro.focus();
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(/#navigation-intro$/);
        await expect(
          page.getByRole('heading', { name: 'Navigation introduction' }),
        ).toBeFocused();
        await expect(intro).toHaveAttribute('aria-current', 'location');
        await page.getByRole('switch', { name: 'Disable document navigation' }).check();
        await expect(intro).toHaveAttribute('aria-disabled', 'true');
        await page
          .getByRole('switch', { name: 'Disable document navigation' })
          .uncheck();
        const [popup] = await Promise.all([
          page.waitForEvent('popup'),
          navigation
            .getByRole('link', { name: 'Open another reference window' })
            .click(),
        ]);
        await popup.waitForLoadState();
        expect(await popup.evaluate(() => window.opener === null)).toBe(true);
        await popup.close();
        await page.getByRole('switch', { name: 'No navigation documents' }).check();
        await expect(navigation.getByRole('link')).toHaveCount(0);
        await expect(navigation).toHaveText('No document links.');
        await page.getByRole('switch', { name: 'No navigation documents' }).uncheck();
        await expect(intro).toBeVisible();
        const toc = page.getByRole('navigation', { name: 'On this reference page' });
        const detail = toc.getByRole('link', { name: 'Outline details' });
        await page.getByRole('switch', { name: 'Veto outline activation' }).check();
        await detail.click();
        await expect(page).toHaveURL(/#navigation-intro$/);
        await page.getByRole('switch', { name: 'Veto outline activation' }).uncheck();
        await detail.focus();
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(/#outline-details$/);
        await expect(
          page.getByRole('heading', { name: 'Outline details' }),
        ).toBeFocused();
        await expect(detail).toHaveAttribute('aria-current', 'location');
        if (profile === 'Compact' && width === 320 && direction === 'rtl') {
          await page.getByLabel('Documentation group title').fill('Guides');
          await navigation.screenshot({
            path: '.cache/content-outline-compact-rtl.png',
          });
        }
        for (const region of [navigation, toc]) {
          const escaped = await region.evaluate((element, tolerance) => {
            const root = element.getBoundingClientRect();
            return Array.from(element.querySelectorAll('a, button')).some((item) => {
              const box = item.getBoundingClientRect();
              return (
                box.width > 0 &&
                (box.left < root.left - tolerance || box.right > root.right + tolerance)
              );
            });
          }, TOLERANCE);
          expect(escaped).toBe(false);
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth),
        ).toBeLessThanOrEqual(width + TOLERANCE);
      });
    }
  }
}

interface DeepItem {
  key: string;
  label: string;
  href?: string;
  children?: DeepItem[];
}

for (const profile of PROFILES) {
  test(`${profile} deep outline indentation remains bounded`, async ({ page }) => {
    const width = WIDTHS[0];
    if (width === undefined) throw new Error('Expected narrow width.');
    await page.setViewportSize({ width, height: HEIGHT });
    await page.goto('/');
    await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
    await page.getByRole('option', { name: profile, exact: true }).click();
    let navigation: DeepItem[] = [
      {
        key: 'deep-leaf',
        label: LONG_LABEL,
        href: '#deep-leaf',
      },
    ];
    let toc: DeepItem[] = [{ key: 'deep-leaf', label: LONG_LABEL }];
    const expanded: string[] = [];
    for (let level = 0; level < TREE_POLICY.maxDepth - 1; level++) {
      const key = `level${level}`;
      expanded.push(key);
      navigation = [{ key, label: `Chapter ${level}`, children: navigation }];
      toc = [{ key, label: `Heading ${level}`, children: toc }];
    }
    const currentKey = { state: 'current', mode: 'readWrite' };
    const source = {
      schemaVersion: '0.2',
      state: [
        { key: 'current', kind: 'text', initial: '', access: 'readWrite' },
        { key: 'expanded', kind: 'selection', initial: expanded, access: 'readWrite' },
      ],
      root: {
        type: 'App',
        direction: 'rtl',
        children: [
          {
            type: 'ContentNavigation',
            label: 'Deep documents',
            items: navigation,
            currentKey,
            expandedKeys: { state: 'expanded', mode: 'readWrite' },
          },
          { type: 'ContentToc', label: 'Deep headings', items: toc, currentKey },
          {
            type: 'PageSection',
            title: 'Deep target',
            anchor: 'deep-leaf',
            children: [],
          },
        ],
      },
    };
    await page.getByRole('tab', { name: 'Generative UI', exact: true }).click();
    await page.getByLabel('JSON declaration').fill(JSON.stringify(source));
    await page.getByRole('button', { name: 'Render declaration' }).click();
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    for (const label of ['Deep documents', 'Deep headings']) {
      const region = page.getByRole('navigation', { name: label });
      await expect(region).toHaveCSS('direction', 'rtl');
      const leaf = region.getByRole('link', { name: LONG_LABEL });
      const fits = await leaf.evaluate((element, tolerance) => {
        const parent = element.closest('nav');
        if (parent === null) throw new Error('Expected semantic navigation.');
        const root = parent.getBoundingClientRect();
        const box = element.getBoundingClientRect();
        return box.left >= root.left - tolerance && box.right <= root.right + tolerance;
      }, TOLERANCE);
      expect(fits).toBe(true);
      await leaf.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('heading', { name: 'Deep target' })).toBeFocused();
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width + TOLERANCE);
  });
}
