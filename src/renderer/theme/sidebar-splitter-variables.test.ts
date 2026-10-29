import { expect, it } from 'vitest';
import { sidebarSplitterVariables } from './sidebar-splitter-variables.js';
import { SIDEBAR_POLICY } from '../../core/sidebar-policy.js';
import { SPLITTER_POLICY } from '../../core/splitter-policy.js';

it('sources adapter dimensions from named policy constants', () => {
  const variables = sidebarSplitterVariables();
  expect(variables['--reacd-sidebar-inline']).toBe(`${SIDEBAR_POLICY.inlineRem}rem`);
  expect(variables['--reacd-splitter-extent']).toBe(
    `${SPLITTER_POLICY.verticalExtentRem}rem`,
  );
});
