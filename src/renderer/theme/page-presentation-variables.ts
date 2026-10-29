import { PAGE_PRESENTATION_POLICY } from '../../core/page-presentation-policy.js';

export function pagePresentationVariables() {
  return {
    '--reacd-page-intro-track': `${PAGE_PRESENTATION_POLICY.contentTrackRem}rem`,
    '--reacd-page-emphasis-border': PAGE_PRESENTATION_POLICY.emphasisBorderMultiplier,
    '--reacd-page-title-header': PAGE_PRESENTATION_POLICY.titleScale.header,
    '--reacd-page-title-hero': PAGE_PRESENTATION_POLICY.titleScale.hero,
    '--reacd-page-title-section': PAGE_PRESENTATION_POLICY.titleScale.section,
    '--reacd-page-title-card': PAGE_PRESENTATION_POLICY.titleScale.card,
    '--reacd-page-title-feature': PAGE_PRESENTATION_POLICY.titleScale.feature,
  };
}
