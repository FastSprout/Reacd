import { expect, it } from 'vitest';
import { DOCUMENTATION_LAYOUT_POLICY as POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/documentation-layout-policy.js';
import { documentationLayoutVariables } from './layout-variables.js';

it('provides named SDK layout tokens without application style props', () => {
  expect(documentationLayoutVariables['--page-left-track']).toBe(
    `${POLICY.leftRailRem}rem`,
  );
  expect(documentationLayoutVariables['--page-right-track']).toBe(
    `${POLICY.rightRailRem}rem`,
  );
  expect(documentationLayoutVariables['--shell-height']).toBe(`${POLICY.headerRem}rem`);
});

it('synchronizes container thresholds with the core policy', async () => {
  const { readFileSync } = await import('node:fs');
  const css = readFileSync('src/adapter/shadcn/documentation-layout.css', 'utf8');
  for (const threshold of [
    POLICY.headerNavigationAtRem,
    POLICY.leftRailAtRem,
    POLICY.rightRailAtRem,
  ]) {
    expect(css).toContain(`@container (min-width: ${threshold}rem)`);
  }
});

it('bounds article tracks and includes the border in shell height', async () => {
  const { readFileSync } = await import('node:fs');
  const css = readFileSync('src/adapter/shadcn/documentation-layout.css', 'utf8');
  expect(css).toContain(
    'min-block-size: calc(var(--shell-height) - var(--shell-border))',
  );
  expect(css).toMatch(
    /\.reacd-page-article\s*\{[^}]*grid-template-columns: minmax\(0, 1fr\)/,
  );
  expect(css).toMatch(/\.reacd-page-article\s*\{[^}]*min-inline-size: 0/);
});
