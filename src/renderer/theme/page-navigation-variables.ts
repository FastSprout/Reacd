import { PAGE_FRAME_POLICY } from '../../core/page-navigation-policy.js';

export function pageNavigationVariables() {
  return {
    '--reacd-page-side-track': `${PAGE_FRAME_POLICY.sideTrackRem}rem`,
    '--reacd-page-body-track': `${PAGE_FRAME_POLICY.bodyTrackRem}rem`,
    '--reacd-page-side-grow': PAGE_FRAME_POLICY.sideGrow,
    '--reacd-page-body-grow': PAGE_FRAME_POLICY.bodyGrow,
  };
}
