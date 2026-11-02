import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import type { CSSProperties } from 'react';
import { DOCUMENTATION_LAYOUT_POLICY as POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/documentation-layout-policy.js';

export const documentationLayoutVariables: CSSProperties &
  Record<`--${string}`, string> = {
  '--shell-brand-title': `${POLICY.brandTitleRem}rem`,
  '--shell-layer': String(POLICY.shellLayer),
  '--shell-border': `${LAYOUT_POLICY.borderWidthPx}px`,
  '--page-rail-minimum': `${POLICY.railMinimumRem}rem`,
  '--hero-fluid-title': `${POLICY.heroFluidVw}vw`,
  '--shell-block-size':
    'var(--shell-measured-height, ' +
    'calc(var(--shell-height) + var(--shell-secondary-height)))',
  '--shell-height': `${POLICY.headerRem}rem`,
  '--shell-secondary-height': `${POLICY.sectionNavigationRem}rem`,
  '--page-gutter': `${POLICY.gutterRem}rem`,
  '--page-compact-gutter': `${POLICY.compactGutterRem}rem`,
  '--page-left-track': `${POLICY.leftRailRem}rem`,
  '--page-right-track': `${POLICY.rightRailRem}rem`,
  '--page-gap': `${POLICY.columnGapRem}rem`,
  '--hero-track': `${POLICY.heroTrackRem}rem`,
  '--hero-gap': `${POLICY.heroGapRem}rem`,
  '--hero-minimum': `${POLICY.heroMinimumRem}rem`,
  '--hero-title': `${POLICY.heroTitleRem}rem`,
  '--hero-compact-title': `${POLICY.heroCompactTitleRem}rem`,
};
