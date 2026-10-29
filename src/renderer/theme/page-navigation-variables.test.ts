import { expect, it } from 'vitest';
import { PAGE_FRAME_POLICY } from '../../core/page-navigation-policy.js';
import { pageNavigationVariables } from './page-navigation-variables.js';

it('derives all page frame dimensions from named core policy', () => {
  expect(pageNavigationVariables()).toEqual({
    '--reacd-page-side-track': `${PAGE_FRAME_POLICY.sideTrackRem}rem`,
    '--reacd-page-body-track': `${PAGE_FRAME_POLICY.bodyTrackRem}rem`,
    '--reacd-page-side-grow': PAGE_FRAME_POLICY.sideGrow,
    '--reacd-page-body-grow': PAGE_FRAME_POLICY.bodyGrow,
  });
});
