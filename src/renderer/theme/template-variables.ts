import { marqueeVariables } from './marquee-variables.js';
import { editorVariables } from './editor-variables.js';
import type { CSSProperties } from 'react';
import { colorPickerVariables } from './color-picker-variables.js';
import { chatComposerVariables } from './chat-composer-variables.js';
import { calendarVariables } from './calendar-variables.js';
import { chatVariables } from './chat-variables.js';
import { elementVariables } from './element-variables.js';
import { chatFeedbackVariables } from './chat-feedback-variables.js';
import { toastVariables } from './toast-variables.js';
import { shellVariables } from './shell-variables.js';
import { pageCompositionVariables } from './page-composition-variables.js';
import { pagePresentationVariables } from './page-presentation-variables.js';
import { pageNavigationVariables } from './page-navigation-variables.js';
import { sidebarSplitterVariables } from './sidebar-splitter-variables.js';
import { commandVariables } from './command-variables.js';
import { editorialVariables } from './editorial-variables.js';
import { pricingVariables } from './pricing-variables.js';
import { panelVariables } from './panel-variables.js';
import { actionMenuVariables } from './action-menu-variables.js';
import { navigationCompositionVariables } from './navigation-composition-variables.js';
import { LAYOUT_POLICY } from '../../core/policy.js';
import { MODAL_POLICY } from '../../core/modal-policy.js';
import { TOGGLE_POLICY } from '../../core/toggle-policy.js';
import { CHOICE_POLICY } from '../../core/choice-policy.js';
import { AVATAR_DIMENSIONS, AVATAR_POLICY } from '../../core/avatar-policy.js';
import { CHIP_POLICY } from '../../core/chip-policy.js';
import { TOOLTIP_POLICY } from '../../core/tooltip-policy.js';
import { KBD_POLICY } from '../../core/kbd-policy.js';
import { POPOVER_POLICY } from '../../core/popover-policy.js';
import { SKELETON_POLICY } from '../../core/skeleton-policy.js';
import { EMPTY_POLICY } from '../../core/empty-policy.js';
import type { DesignTemplate } from '../../schema/design/templates.schema.js';

const FONTS = {
  humanist: "'Trebuchet MS', 'Segoe UI', sans-serif",
  system: 'Arial, Helvetica, sans-serif',
} as const;

const SHADOWS = { soft: '0 2px 8px #172a240a', none: 'none' } as const;

export function templateVariables(template: DesignTemplate): CSSProperties {
  const variables: CSSProperties & Record<`--reacd-${string}`, string | number> = {
    ...editorVariables(),
    ...colorPickerVariables(),
    ...marqueeVariables(),
    ...chatComposerVariables(),
    ...calendarVariables(),
    ...chatVariables(),
    ...elementVariables(),
    ...chatFeedbackVariables(),
    ...shellVariables(),
    ...pageCompositionVariables(),
    ...pagePresentationVariables(),
    ...pageNavigationVariables(),
    ...sidebarSplitterVariables(),
    ...commandVariables(),
    ...editorialVariables(),
    ...pricingVariables(),
    ...panelVariables(),
    ...actionMenuVariables(),
    ...toastVariables(),
    ...navigationCompositionVariables(),
    '--reacd-modal-layer': MODAL_POLICY.layer,
    '--reacd-skeleton-line-small': `${SKELETON_POLICY.lineEm.small}em`,
    '--reacd-skeleton-line-medium': `${SKELETON_POLICY.lineEm.medium}em`,
    '--reacd-skeleton-line-large': `${SKELETON_POLICY.lineEm.large}em`,
    '--reacd-skeleton-rectangle-small': `${SKELETON_POLICY.rectangleRem.small}rem`,
    '--reacd-skeleton-rectangle-medium': `${SKELETON_POLICY.rectangleRem.medium}rem`,
    '--reacd-skeleton-rectangle-large': `${SKELETON_POLICY.rectangleRem.large}rem`,
    '--reacd-skeleton-last-line': `${SKELETON_POLICY.lastLinePercent}%`,
    '--reacd-skeleton-duration': `${SKELETON_POLICY.pulseDurationMs}ms`,
    '--reacd-skeleton-iterations': SKELETON_POLICY.pulseIterations,
    '--reacd-skeleton-pulse-opacity': SKELETON_POLICY.pulseOpacity,
    '--reacd-empty-content-width': `${EMPTY_POLICY.contentWidthRem}rem`,
    '--reacd-empty-title-small': EMPTY_POLICY.titleScale.small,
    '--reacd-empty-title-medium': EMPTY_POLICY.titleScale.medium,
    '--reacd-empty-title-large': EMPTY_POLICY.titleScale.large,
    '--reacd-empty-solid-border': EMPTY_POLICY.solidBorderMultiplier,
    '--reacd-kbd-small': KBD_POLICY.textScale.small,
    '--reacd-kbd-medium': KBD_POLICY.textScale.medium,
    '--reacd-kbd-large': KBD_POLICY.textScale.large,
    '--reacd-popover-width': `${POPOVER_POLICY.widthRem}rem`,
    '--reacd-popover-arrow': `${POPOVER_POLICY.arrowRem}rem`,
    '--reacd-tooltip-width': `${TOOLTIP_POLICY.widthRem}rem`,
    '--reacd-tooltip-arrow': `${TOOLTIP_POLICY.arrowRem}rem`,
    '--reacd-chip-clearance': `${CHIP_POLICY.clearanceRem}rem`,
    '--reacd-chip-max-inline': `${CHIP_POLICY.maxInlineRem}rem`,
    '--reacd-chip-dot-small': `${CHIP_POLICY.dotRem.small}rem`,
    '--reacd-chip-dot-medium': `${CHIP_POLICY.dotRem.medium}rem`,
    '--reacd-chip-dot-large': `${CHIP_POLICY.dotRem.large}rem`,
    '--reacd-chip-font-small': CHIP_POLICY.textScale.small,
    '--reacd-chip-font-medium': CHIP_POLICY.textScale.medium,
    '--reacd-chip-font-large': CHIP_POLICY.textScale.large,
    '--reacd-popup-layer': MODAL_POLICY.popupLayer,
    '--reacd-modal-width': `${MODAL_POLICY.widthRem}rem`,
    '--reacd-backdrop-percent': `${MODAL_POLICY.backdropPercent}%`,
    '--reacd-small': `${template.spacing.small}rem`,
    '--reacd-medium': `${template.spacing.medium}rem`,
    '--reacd-large': `${template.spacing.large}rem`,
    '--reacd-radius': `${template.radius}rem`,
    '--reacd-font-size': `${template.fontSize}rem`,
    '--reacd-font': FONTS[template.font],
    '--reacd-shadow': SHADOWS[template.shadow],
    '--reacd-control-target': `${LAYOUT_POLICY.controlTargetPx}px`,
    '--reacd-choice-marker-ratio': CHOICE_POLICY.markerRatio,
    '--reacd-avatar-small': `${AVATAR_DIMENSIONS.small.rem}rem`,
    '--reacd-avatar-medium': `${AVATAR_DIMENSIONS.medium.rem}rem`,
    '--reacd-avatar-large': `${AVATAR_DIMENSIONS.large.rem}rem`,
    '--reacd-avatar-font-divisor': AVATAR_POLICY.fallbackFontDivisor,
    '--reacd-toggle-ratio': TOGGLE_POLICY.trackRatio,
    '--reacd-toggle-min-track': `${TOGGLE_POLICY.minTrackRem}rem`,
    '--reacd-toggle-inset': `${TOGGLE_POLICY.thumbInsetPx}px`,
    '--reacd-grid-track': `${LAYOUT_POLICY.gridTrackRem}rem`,
    '--reacd-stack-track': `${LAYOUT_POLICY.stackTrackRem}rem`,
    '--reacd-padding-limit': `${LAYOUT_POLICY.maxPaddingPercent}%`,
    '--reacd-focus-width': `${LAYOUT_POLICY.focusOutlinePx}px`,
    '--reacd-border-width': `${LAYOUT_POLICY.borderWidthPx}px`,
    '--reacd-page-width': `${LAYOUT_POLICY.pageWidthRem}rem`,
    '--reacd-split-track': `${LAYOUT_POLICY.splitTrackRem}rem`,
    '--reacd-compact': `${LAYOUT_POLICY.compactViewportPx}px`,
    '--reacd-table-column': `${LAYOUT_POLICY.tableColumnRem}rem`,
  };
  for (const [key, value] of Object.entries(template.colors)) {
    variables[`--reacd-${key}`] = value;
  }
  return variables;
}
