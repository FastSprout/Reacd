import {
  openUnsupportedExample,
  expectUnsupportedDiagnostic,
} from '../native-capabilities.js';
import { watchPreviewFailures } from '../preview-failures.js';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { DESIGN_POLICY, LAYOUT_POLICY } from '../../../src/core/policy.js';
import { contrastRatio } from '../../../src/schema/design/templates.schema.js';
import { paintedColors } from '../painted-colors.js';
import { CHAT_FEEDBACK_POLICY } from '../../../src/core/chat-feedback-policy.js';
import { CHAT_CONTRAST_TEMPLATE } from '../../chat-contrast.js';

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
  const details = page.getByRole('region', {
    name: /^(Reasoning summary|Example reference reader details)$/,
  });
  await expect(details).toHaveCount(2);
  expect(
    await details.evaluateAll(
      (elements, tolerance) =>
        elements.every(
          (element) => element.scrollWidth <= element.clientWidth + tolerance,
        ),
      TOLERANCE,
    ),
  ).toBe(true);
  const targets = page.getByRole('button', {
    name: /^(Reasoning summary|Example reference reader)$/,
  });
  await expect(targets).toHaveCount(2);
  expect(
    await targets.evaluateAll(
      (elements, minimum) =>
        elements.every((element) => {
          const box = element.getBoundingClientRect();
          return box.width >= minimum && box.height >= minimum;
        }),
      LAYOUT_POLICY.controlTargetPx,
    ),
  ).toBe(true);
}

for (const profile of ['Spacious', 'Compact']) {
  for (const width of WIDTHS) {
    test(
      'native SDK contract: ' + `${profile} feedback at ${width}px, RTL and 200%`,
      async ({ page }) => {
        await page.setViewportSize({ width, height: HEIGHT });
        if (test.info().project.name === 'mui') {
          await openUnsupportedExample(
            page,
            profile,
            'Content and data',
            'ChatFeedback',
            'ChatReasoning',
          );

          await page.locator('html').evaluate((element) => {
            element.style.fontSize = '200%';
          });
          await expect(
            page.getByText('Cannot load ChatFeedback', { exact: true }),
          ).toBeVisible();
          return;
        }

        await content(page, profile);
        await page
          .getByRole('textbox', { name: 'Example summary text' })
          .fill(LONG_TEXT);
        await page
          .getByRole('textbox', { name: 'Example tool output' })
          .fill(LONG_TEXT);
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
        await expect(
          page.getByRole('region', { name: 'Reasoning summary', exact: true }),
        ).toHaveCSS('direction', 'rtl');
        await expect(
          page.getByRole('region', { name: 'Example reference reader details' }),
        ).toHaveCSS('direction', 'rtl');
        const shimmer = page
          .getByRole('region', { name: 'Chat shimmer preview' })
          .getByText(LONG_TEXT, { exact: true })
          .locator('..');
        await expect(shimmer).toHaveCSS('direction', 'rtl');
        await contained(page);
      },
    );
  }

  test(
    'native SDK contract: ' +
      `${profile} summary auto policy and explicit tool decisions`,
    async ({ page }) => {
      if (test.info().project.name === 'mui') {
        await openUnsupportedExample(
          page,
          profile,
          'Content and data',
          'ChatFeedback',
          'ChatReasoning',
        );
        return;
      }

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
    },
  );

  test(
    'native SDK contract: ' +
      `${profile} shimmer motion preferences retain visible full text`,
    async ({ page }) => {
      if (test.info().project.name === 'mui') {
        await openUnsupportedExample(
          page,
          profile,
          'Content and data',
          'ChatFeedback',
          'ChatReasoning',
        );
        return;
      }

      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await content(page, profile);
      const shimmer = page
        .getByRole('region', { name: 'Chat shimmer preview' })
        .getByText('Processing an example request.', { exact: true })
        .locator('..');
      const skeleton = shimmer.locator('[data-slot="skeleton"]');
      await expect(skeleton).toHaveAttribute('aria-hidden', 'true');
      const decoration = await skeleton.evaluate((element) => {
        const style = getComputedStyle(element);
        return { name: style.animationName, count: style.animationIterationCount };
      });
      expect(decoration.name).not.toBe('none');
      expect(decoration.count).toBe(String(CHAT_FEEDBACK_POLICY.pulseIterations));
      await expect(shimmer).toHaveCSS('animation-name', 'none');
      await expect(shimmer).toHaveCSS('opacity', '1');
      await page.emulateMedia({ reducedMotion: 'reduce' });
      expect(
        await skeleton.evaluate((element) => getComputedStyle(element).animationName),
      ).toBe('none');
      await expect(shimmer).toHaveCSS('animation-name', 'none');
      await expect(shimmer).toHaveText('Processing an example request.');
      await page.getByRole('switch', { name: 'Animate example status' }).uncheck();
      await expect(shimmer).not.toHaveAttribute('role', 'status');
      await expect(skeleton).toHaveCount(0);
      await expect(shimmer).toHaveCSS('animation-name', 'none');
    },
  );
}

test(
  'native SDK contract: ' + 'valid opposite-luminance template preserves shimmer text',
  async ({ page }) => {
    if (test.info().project.name === 'mui') {
      const failures = watchPreviewFailures(page);
      await page.goto('/');
      await page.getByRole('combobox', { name: 'Appearance', exact: true }).click();
      await page.getByRole('option', { name: 'Spacious', exact: true }).click();
      await page.getByRole('tab', { name: 'Generative UI', exact: true }).click();
      await expectUnsupportedDiagnostic(page, failures, 'Generative UI', 'SplitView');
      return;
    }

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
          children: [
            { type: 'ChatShimmer', text: 'Contrast regression', active: true },
          ],
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
      const paint = await paintedColors(shimmer);
      expect(paint.foreground).toBe(CHAT_CONTRAST_TEMPLATE.colors.muted);
      expect(paint.background).toBe(CHAT_CONTRAST_TEMPLATE.colors.surface);
      expect(contrastRatio(paint.foreground, paint.background)).toBeGreaterThanOrEqual(
        DESIGN_POLICY.minTextContrast,
      );
      await expect(shimmer).toHaveCSS('opacity', '1');
    }
  },
);
