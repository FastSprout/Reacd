import { PAGE_COMPOSITION_POLICY } from '../../core/page-composition-policy.js';

export function pageCompositionVariables() {
  return {
    '--reacd-page-columns': PAGE_COMPOSITION_POLICY.maximumColumns,
    '--reacd-page-column-track': `${PAGE_COMPOSITION_POLICY.columnTrackRem}rem`,
  };
}
