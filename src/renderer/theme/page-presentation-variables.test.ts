import { expect, it } from 'vitest';
import { PAGE_PRESENTATION_POLICY } from '../../core/page-presentation-policy.js';
import { pagePresentationVariables } from './page-presentation-variables.js';

it('derives every introduction dimension from named core policy', () => {
  const variables = pagePresentationVariables();
  expect(variables['--reacd-page-intro-track']).toBe(
    `${PAGE_PRESENTATION_POLICY.contentTrackRem}rem`,
  );
  expect(variables['--reacd-page-emphasis-border']).toBe(
    PAGE_PRESENTATION_POLICY.emphasisBorderMultiplier,
  );
  expect(variables['--reacd-page-title-header']).toBe(
    PAGE_PRESENTATION_POLICY.titleScale.header,
  );
  expect(variables['--reacd-page-title-hero']).toBe(
    PAGE_PRESENTATION_POLICY.titleScale.hero,
  );
  expect(variables['--reacd-page-title-section']).toBe(
    PAGE_PRESENTATION_POLICY.titleScale.section,
  );
  expect(variables['--reacd-page-title-card']).toBe(
    PAGE_PRESENTATION_POLICY.titleScale.card,
  );
  expect(variables['--reacd-page-title-feature']).toBe(
    PAGE_PRESENTATION_POLICY.titleScale.feature,
  );
});
