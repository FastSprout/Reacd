import { expect, it } from 'vitest';
import { pageCompositionVariables } from './page-composition-variables.js';
import { PAGE_COMPOSITION_POLICY } from '../../core/page-composition-policy.js';

it('uses named page track and column constraints', () => {
  expect(pageCompositionVariables()).toEqual({
    '--reacd-page-columns': PAGE_COMPOSITION_POLICY.maximumColumns,
    '--reacd-page-column-track': `${PAGE_COMPOSITION_POLICY.columnTrackRem}rem`,
  });
});
