import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LAYOUT_POLICY } from '../../src/core/policy.js';
import { CHAT_FEEDBACK_POLICY } from '../../src/core/chat-feedback-policy.js';
import { CHAT_CONTRAST_TEMPLATE } from '../../test-support/chat-contrast.js';

const WIDTHS = [240, 360, 768, 1440];
const HEIGHT = 1000;
const TOLERANCE = 1;
const LONG_TEXT = 'Unbroken_example_feedback_'.repeat(30);

async function content(page: Page, profile: string) {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
  await page.getByRole('option', { name: profile, exact: true }).click();
  await page.getByRole('button', { name: 'Content and data', exact: true }).click();
}

async function contained(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual((await page.evaluate(() => innerWidth)) + TOLERANCE);
  const details = await page
    .locator('.reacd-chat-feedback-details:visible')
    .evaluateAll(
      (elements, tolerance) =>
        elements.every(
          (element) => element.scrollWidth <= element.clientWidth + tolerance,
        ),
      TOLERANCE,
    );
  expect(details).toBe(true);
  const targets = await page
    .locator(
      '.reacd-chat-disclosure button, .reacd-chat-tool > .reacd-chat-actions button',
    )
    .evaluateAll(
      (elements, minimum) =>
        elements.every((element) => {
          const box = element.getBoundingClientRect();
          return box.width >= minimum && box.height >= minimum;
        }),
      LAYOUT_POLICY.controlTargetPx,
    );
  expect(targets).toBe(true);
}

for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(`${profile} feedback at ${width}px, RTL and 200%`, async ({ page }) => {
      await page.setViewportSize({ width, height: HEIGHT });
      await content(page, profile);
      await page.getByRole('textbox', { name: 'Example summary text' }).fill(LONG_TEXT);
      await page.getByRole('textbox', { name: 'Example tool output' }).fill(LONG_TEXT);
      await page
        .getByRole('textbox', { name: 'Example progress text' })
        .fill(LONG_TEXT);
      await page
        .getByRole('button', { name: 'Reasoning summary', exact: true })
        .click();
      await page
        .getByRole('button', { name: 'Example reference reader', exact: true })
        .click();
      await contained(page);
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      await page.getByRole('switch', { name: 'Right to left chat feedback' }).check();
      await page.getByRole('switch', { name: 'Right to left summary' }).check();
      await expect(page.locator('.reacd-chat-reasoning')).toHaveCSS('direction', 'rtl');
      await expect(page.locator('.reacd-chat-tool')).toHaveCSS('direction', 'rtl');
      const shimmer = page
        .getByRole('region', { name: 'Chat shimmer preview' })
        .locator('.reacd-chat-shimmer');
      await expect(shimmer).toHaveCSS('direction', 'rtl');
      await contained(page);
    });
  }

  test(`${profile} summary auto policy and explicit tool decisions`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await content(page, profile);
    const summary = page.getByRole('button', {
      name: 'Reasoning summary',
      exact: true,
    });
    const streaming = page.getByRole('switch', { name: 'Streaming summary' });
    await streaming.check();
    await expect(summary).toHaveAttribute('aria-expanded', 'false');
    await page.getByRole('switch', { name: 'Automatic summary disclosure' }).check();
    await streaming.uncheck();
    await streaming.check();
    await expect(summary).toHaveAttribute('aria-expanded', 'true');
    await summary.focus();
    await page.keyboard.press('Enter');
    await streaming.uncheck();
    await expect(summary).toHaveAttribute('aria-expanded', 'false');
    await streaming.check();
    await expect(summary).toHaveAttribute('aria-expanded', 'true');
    await streaming.uncheck();
    await expect(summary).toHaveAttribute('aria-expanded', 'false');
    await page.getByRole('switch', { name: 'Protect summary disclosure' }).check();
    await streaming.check();
    await expect(summary).toBeDisabled();
    await expect(summary).toHaveAttribute('aria-expanded', 'false');
    await page.getByRole('button', { name: 'Request example tool approval' }).click();
    await page.getByRole('button', { name: 'Approve tool request' }).focus();
    await page.keyboard.press('Space');
    await expect(
      page.getByText('Approved example request.', { exact: true }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Request example tool approval' }).click();
    await page.getByRole('switch', { name: 'Protect tool actions' }).check();
    await expect(
      page.getByRole('button', { name: 'Approve tool request' }),
    ).toBeDisabled();
    await page.getByRole('switch', { name: 'Protect tool actions' }).uncheck();
    await page.getByRole('button', { name: 'Reject tool request' }).click();
    await expect(
      page.getByText('Rejected example request.', { exact: true }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Retry tool request' }).click();
    await expect(
      page
        .getByRole('region', { name: 'Chat tool preview', exact: true })
        .getByText('Pending', { exact: true }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });

  test(`${profile} shimmer motion preferences retain visible full text`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await content(page, profile);
    const shimmer = page
      .getByRole('region', { name: 'Chat shimmer preview' })
      .locator('.reacd-chat-shimmer');
    const decoration = await shimmer.evaluate((element) => {
      const style = getComputedStyle(element, '::after');
      return { name: style.animationName, count: style.animationIterationCount };
    });
    expect(decoration.name).not.toBe('none');
    expect(decoration.count).toBe(String(CHAT_FEEDBACK_POLICY.pulseIterations));
    await expect(shimmer).toHaveCSS('animation-name', 'none');
    await expect(shimmer).toHaveCSS('opacity', '1');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(
      await shimmer.evaluate(
        (element) => getComputedStyle(element, '::after').animationName,
      ),
    ).toBe('none');
    await expect(shimmer).toHaveCSS('animation-name', 'none');
    await expect(shimmer).toHaveText('Processing an example request.');
    await page.getByRole('switch', { name: 'Animate example status' }).uncheck();
    await expect(shimmer).not.toHaveAttribute('role', 'status');
    await expect(shimmer).toHaveCSS('animation-name', 'none');
  });
}

test('valid opposite-luminance template preserves shimmer text', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.getByRole('tab', { name: 'Generative UI', exact: true }).click();
  await page.getByRole('textbox', { name: 'JSON declaration' }).fill(
    JSON.stringify({
      schemaVersion: '0.2',
      state: [],
      root: {
        type: 'Theme',
        template: CHAT_CONTRAST_TEMPLATE,
        children: [{ type: 'ChatShimmer', text: 'Contrast regression', active: true }],
      },
    }),
  );
  await page.getByRole('button', { name: 'Render declaration' }).click();
  const shimmer = page.getByText('Contrast regression', { exact: true });
  await expect(shimmer).toBeVisible();
  for (const fraction of [0, 0.25, 0.5, 0.75, 1]) {
    await shimmer.evaluate((element, progress) => {
      for (const animation of element.getAnimations({ subtree: true })) {
        animation.pause();
        const duration = animation.effect?.getTiming().duration;
        if (typeof duration === 'number') animation.currentTime = duration * progress;
      }
    }, fraction);
    await expect(shimmer).toHaveCSS('color', 'rgb(0, 0, 0)');
    await expect(shimmer).toHaveCSS('opacity', '1');
  }
});
