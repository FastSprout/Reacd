import {
  NAVIGATION_COMPOSITION_POLICY,
} from '../../core/navigation-composition-policy.js';

export function navigationCompositionVariables() {
  return {
    '--reacd-navigation-column': `${NAVIGATION_COMPOSITION_POLICY.columnWidthRem}rem`,
    '--reacd-navigation-popup': `${NAVIGATION_COMPOSITION_POLICY.popupWidthRem}rem`,
    '--reacd-step-description-scale':
      NAVIGATION_COMPOSITION_POLICY.stepDescriptionScale,
  };
}
