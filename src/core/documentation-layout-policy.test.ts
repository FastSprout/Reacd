import { expect, it } from 'vitest';
import { DOCUMENTATION_LAYOUT_POLICY } from './documentation-layout-policy.js';

it('keeps readable article space before adding each navigation rail', () => {
  const policy = DOCUMENTATION_LAYOUT_POLICY;
  expect(policy.leftRailAtRem).toBeGreaterThan(
    policy.leftRailRem + policy.columnGapRem,
  );
  expect(policy.rightRailAtRem).toBeGreaterThan(policy.leftRailAtRem);
  expect(policy.gutterRem).toBeGreaterThan(policy.compactGutterRem);
  expect(policy.headerRem + policy.sectionNavigationRem).toBe(7);
});
