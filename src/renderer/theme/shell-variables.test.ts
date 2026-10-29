import { expect, it } from 'vitest';
import { shellVariables } from './shell-variables.js';
import { SHELL_POLICY, SEPARATOR_POLICY } from '../../core/shell-policy.js';

it('derives shell dimensions from named engine policies', () => {
  expect(shellVariables()).toEqual({
    '--reacd-shell-menu-width': `${SHELL_POLICY.menuWidthRem}rem`,
    '--reacd-shell-menu-block': `${SHELL_POLICY.menuBlockPercent}%`,
    '--reacd-shell-menu-layer': SHELL_POLICY.menuLayer,
    '--reacd-shell-track': `${SHELL_POLICY.slotTrackRem}rem`,
    '--reacd-separator-extent': `${SEPARATOR_POLICY.verticalExtentRem}rem`,
    '--reacd-separator-small': `${SEPARATOR_POLICY.smallWidthPx}px`,
    '--reacd-separator-medium': `${SEPARATOR_POLICY.mediumWidthPx}px`,
    '--reacd-separator-large': `${SEPARATOR_POLICY.largeWidthPx}px`,
  });
});
