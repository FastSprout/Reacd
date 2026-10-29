import { expect, it } from 'vitest';
import { actionMenuVariables } from './action-menu-variables.js';
it('maps every named menu dimension to a private token', () => {
  expect(actionMenuVariables()).toEqual({
    '--reacd-action-width': '18rem',
    '--reacd-action-block': '85dvh',
    '--reacd-action-indicator': '1.25em',
  });
});
